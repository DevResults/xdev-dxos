import { useNavigate, useParams } from "react-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { useClient } from "@dxos/react-client"
import { useSpaces } from "@dxos/react-client/echo"
import { useIdentity } from "@dxos/react-client/halo"
import {
  type AuthenticatingInvitationObservable,
  Invitation,
  useInvitationStatus,
} from "@dxos/react-client/invitations"
import { JoinSpaceForm } from "ui/JoinSpaceForm"
import { useLocalState } from "~/hooks/useLocalState"
import { useRedirect } from "~/hooks/useRedirect"
import { makeContact } from "~/schema/Contact"

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

  const invitationCode = invitationCodeFromUrl ?? savedInvitationCode

  // Hooks ↑

  useRedirect(
    invitationCode ?
      {
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

  // Reactively watch for the joined space to appear in the spaces list.
  // useSpaces() re-renders when the list changes, so we don't need to poll.
  const contactCreatedRef = useRef(false)
  useEffect(() => {
    if (!joinedSpaceId || !identity) {
      return
    }

    const space = spaces.find(s => s.key.toHex() === joinedSpaceId)
    if (!space) {
      return
    }

    // Save space key to local storage — this triggers useRedirect to navigate to /
    update({ spaceKey: space.id, invitationCode: "" })

    // Build a contact for yourself in the background (only once)
    if (!contactCreatedRef.current) {
      contactCreatedRef.current = true
      void (async () => {
        try {
          await space.waitUntilReady()
          const contact = makeContact({
            identityId: identity.identityKey.toString(),
            avatarUrl: "",
            firstName: identity.profile!.displayName!,
            lastName: "",
            userName: identity.profile!.displayName!,
          })
          space.db.add(contact)
          await space.db.flush()
        } catch (error) {
          console.error("[JOIN] Error creating contact:", error)
        }
      })()
    }

    void navigate("/")
  }, [joinedSpaceId, spaces, identity, update, navigate])

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
