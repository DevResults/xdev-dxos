import { useNavigate, useParams } from "react-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { useClient } from "@dxos/react-client"
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
  const { spaceKey, invitationCode: savedInvitationCode, update } = useLocalState()
  const invitationCodeFromUrl = useParams().code

  const invitationRef = useRef<AuthenticatingInvitationObservable | undefined>()
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const invitationCode = invitationCodeFromUrl ?? savedInvitationCode

  // Hooks ↑

  useRedirect({
    from: /.*/,
    to: "/auth/begin",
    condition: !identity,
    localState: { invitationCode },
  })
  useRedirect({ from: /.*/, to: "/", condition: Boolean(spaceKey) })

  // Get invitation status from the hook
  const invitationStatus = useInvitationStatus(invitationRef.current)

  // Handle successful join
  useEffect(() => {
    if (invitationStatus.status !== Invitation.State.SUCCESS) {
      return
    }

    if (!invitationStatus.result.spaceKey) {
      return
    }

    const spaceId = invitationStatus.result.spaceKey.toHex()
    const space = client.spaces.get().find(s => s.id === spaceId)

    if (!space) {
      setErrorMessage("Failed to find space after joining")
      return
    }

    // Save our user info etc. to local storage
    update({ spaceKey: space.id, invitationCode: "" })

    // Build a contact for yourself
    void (async () => {
      await space.waitUntilReady()
      const contact = makeContact({
        identityId: identity!.identityKey.toString(),
        avatarUrl: "",
        firstName: identity!.profile!.displayName!,
        lastName: "",
        userName: identity!.profile!.displayName!,
      })
      space.db.add(contact)
      void navigate("/")
    })()
  }, [
    invitationStatus.status,
    invitationStatus.result.spaceKey,
    client,
    identity,
    update,
    navigate,
  ])

  // Handle errors
  useEffect(() => {
    switch (invitationStatus.status) {
      case Invitation.State.ERROR: {
        setErrorMessage("Something went wrong while joining. Please try again.")

        break
      }

      case Invitation.State.TIMEOUT: {
        setErrorMessage("The invitation timed out. Please try again.")

        break
      }

      case Invitation.State.CANCELLED: {
        setErrorMessage("The invitation was cancelled.")

        break
      }

      case Invitation.State.INIT:
      case Invitation.State.CONNECTING:
      case Invitation.State.CONNECTED:
      case Invitation.State.READY_FOR_AUTHENTICATION:
      case Invitation.State.AUTHENTICATING:
      case Invitation.State.SUCCESS:
      case Invitation.State.EXPIRED: {
        // These states don't set error messages
        break
      }
    }
  }, [invitationStatus.status])

  const handleJoin = useCallback(
    (code: string) => {
      setErrorMessage(undefined)
      try {
        // Join returns an AuthenticatingInvitation
        invitationRef.current = client.spaces.join(code)
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
    invitationRef.current = undefined
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
