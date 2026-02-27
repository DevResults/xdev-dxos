import { useNavigate, useParams } from "react-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { useClient } from "@dxos/react-client"
import { Filter, useQuery, useSpace, useSpaces } from "@dxos/react-client/echo"
import { useIdentity } from "@dxos/react-client/halo"
import {
  type AuthenticatingInvitationObservable,
  Invitation,
  useInvitationStatus,
} from "@dxos/react-client/invitations"
import { JoinSpaceForm } from "ui/JoinSpaceForm"
import { getInvitationForJoin } from "~/lib/getInvitationForJoin"
import { useLocalState } from "~/hooks/useLocalState"
import { useRedirect } from "~/hooks/useRedirect"
import { Contact, make as makeContact } from "~/schema/Contact"
import { Invitation as InvitationRecord } from "~/schema/Invitation"

export default function AuthJoinPage() {
  const identity = useIdentity()
  const navigate = useNavigate()
  const client = useClient()
  const spaces = useSpaces()
  const { spaceKey, invitationCode: savedInvitationCode, update } = useLocalState()
  const invitationCodeFromUrl = useParams().code

  // Store invitation in state so changes trigger re-renders for useInvitationStatus
  const [invitation, setInvitation] = useState<AuthenticatingInvitationObservable | undefined>()
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  /** The space ID we're waiting for after a successful invitation. */
  const [joinedSpaceId, setJoinedSpaceId] = useState<string | undefined>()
  /** Invitation code used for join lookup when code was entered manually. */
  const [submittedInvitationCode, setSubmittedInvitationCode] = useState<string | undefined>()

  const invitationCode = invitationCodeFromUrl ?? savedInvitationCode
  const invitationCodeForLookup = submittedInvitationCode ?? invitationCode
  const joinedSpace = useSpace(joinedSpaceId)
  const joinedContacts = useQuery(joinedSpace, Filter.type(Contact))
  const joinedInvitations = useQuery(joinedSpace, Filter.type(InvitationRecord))

  // Hooks ↑

  useRedirect(
    invitationCode
      ? {
          from: /.*/,
          to: "/auth/begin",
          condition: !identity,
          localState: { invitationCode },
        }
      : {
          from: /.*/,
          to: "/auth/begin",
          condition: !identity,
        },
  )
  useRedirect({ from: /.*/, to: "/", condition: Boolean(spaceKey) })

  // Get invitation status from the hook
  const invitationStatus = useInvitationStatus(invitation)

  // When the invitation succeeds, record the space ID we need to find.
  useEffect(() => {
    if (invitationStatus.status !== Invitation.State.SUCCESS) {
      return
    }

    if (!invitationStatus.result.spaceKey) {
      return
    }

    setJoinedSpaceId(invitationStatus.result.spaceKey.toHex())
  }, [invitationStatus.status, invitationStatus.result.spaceKey])

  // Reconcile invitation/contact records once the joined space is available.
  const joinReconciledRef = useRef(false)
  useEffect(() => {
    if (!joinedSpaceId || !identity || !joinedSpace) {
      return
    }

    if (joinReconciledRef.current) {
      return
    }

    joinReconciledRef.current = true
    void (async () => {
      try {
        await joinedSpace.waitUntilReady()

        const invitationRecord = getInvitationForJoin(invitationCodeForLookup, joinedInvitations)
        const matchedContact = invitationRecord
          ? joinedContacts.find(contact => contact.id === invitationRecord.contactId)
          : undefined

        if (matchedContact) {
          matchedContact.identityId = identity.identityKey.toString()
          invitationRecord!.status = "accepted"
          invitationRecord!.acceptedAt = new Date().toISOString()
        } else {
          // Backward compatibility for spaces that don't have pre-created contacts.
          const contact = makeContact({
            identity,
            avatarUrl: "",
            firstName: identity.profile!.displayName!,
            lastName: "",
            userName: identity.profile!.displayName!,
          })
          joinedSpace.db.add(contact)
        }

        await joinedSpace.db.flush()
        update({ spaceKey: joinedSpace.id, invitationCode: "" })
        void navigate("/")
      } catch (error) {
        joinReconciledRef.current = false
        console.error("[JOIN] Error reconciling joined contact:", error)
      }
    })()
  }, [
    identity,
    invitationCodeForLookup,
    joinedContacts,
    joinedInvitations,
    joinedSpace,
    joinedSpaceId,
    navigate,
    update,
  ])

  // Track the latest status in a ref so we can check it asynchronously
  const latestStatusRef = useRef(invitationStatus.status)
  latestStatusRef.current = invitationStatus.status

  // Handle errors - but delay to avoid showing transient CANCELLED states
  // (can happen due to cached invitation state from DXOS InvitationsProxy)
  useEffect(() => {
    // Clear any previous error when we move to a connecting/progress state
    if (
      invitationStatus.status === Invitation.State.CONNECTING ||
      invitationStatus.status === Invitation.State.CONNECTED ||
      invitationStatus.status === Invitation.State.READY_FOR_AUTHENTICATION ||
      invitationStatus.status === Invitation.State.AUTHENTICATING
    ) {
      setErrorMessage(undefined)
      return
    }

    // For error states, wait to see if we recover
    // This handles the case where CANCELLED is emitted briefly due to cached state
    if (
      invitationStatus.status === Invitation.State.ERROR ||
      invitationStatus.status === Invitation.State.TIMEOUT ||
      invitationStatus.status === Invitation.State.CANCELLED
    ) {
      const timeout = setTimeout(() => {
        // Re-check the CURRENT status via ref (not stale closure value)
        const currentStatus = latestStatusRef.current

        // If we've recovered to a good state, don't show error
        if (
          currentStatus === Invitation.State.CONNECTING ||
          currentStatus === Invitation.State.CONNECTED ||
          currentStatus === Invitation.State.READY_FOR_AUTHENTICATION ||
          currentStatus === Invitation.State.AUTHENTICATING ||
          currentStatus === Invitation.State.SUCCESS
        ) {
          return
        }

        switch (currentStatus) {
          case Invitation.State.ERROR: {
            setErrorMessage("Something went wrong while joining. Please try again.")
            break
          }

          case Invitation.State.TIMEOUT: {
            setErrorMessage("The invitation timed out. Please try again.")
            break
          }

          case Invitation.State.CANCELLED: {
            setErrorMessage("The invitation was cancelled or is no longer valid.")
            break
          }

          case Invitation.State.INIT:
          case Invitation.State.EXPIRED: {
            // These states don't need error messages in this context
            break
          }
        }
      }, 1000) // Wait 1s to see if state improves
      return () => clearTimeout(timeout)
    }
  }, [invitationStatus.status])

  const handleJoin = useCallback(
    (code: string) => {
      setErrorMessage(undefined)
      setSubmittedInvitationCode(code)
      try {
        setInvitation(client.spaces.join(code))
      } catch {
        setErrorMessage("Invalid invitation code. Please check and try again.")
      }
    },
    [client],
  )

  const handleAuthenticate = useCallback(
    async (authCode: string) => {
      setErrorMessage(undefined)
      try {
        await invitationStatus.authenticate(authCode)
      } catch {
        setErrorMessage("Invalid verification code. Please check and try again.")
      }
    },
    [invitationStatus],
  )

  const handleCancel = useCallback(() => {
    invitationStatus.cancel()
    setInvitation(undefined)
    void navigate("/")
  }, [invitationStatus, navigate])

  return (
    <JoinSpaceForm
      heading="Join a team"
      invitationCode={invitationCode}
      status={invitationStatus.status}
      error={errorMessage}
      onJoin={handleJoin}
      onAuthenticate={handleAuthenticate}
      onCancel={handleCancel}
    />
  )
}
