import { useNavigate, useParams } from "react-router"
import { useState } from "react"
import { useShell } from "@dxos/react-client"
import { useIdentity } from "@dxos/react-client/halo"
import { create } from "@dxos/react-client/echo"
import { InvitationForm } from "./ui/InvitationForm"
import { useLocalState } from "~/hooks/useLocalState"
import { useRedirect } from "~/hooks/useRedirect"
import { Contact } from "~/schema/Contact"

export default function AuthJoinPage() {
  const identity = useIdentity()
  const navigate = useNavigate()
  const { spaceKey, invitationCode: savedInvitationCode, update } = useLocalState()
  const invitationCodeFromUrl = useParams().code
  const [error, setError] = useState<string | undefined>(undefined)
  const shell = useShell()

  const invitationCode = invitationCodeFromUrl ?? savedInvitationCode

  // hooks ↑

  useRedirect({
    from: /.*/,
    to: "/auth/begin",
    condition: !identity,
    localState: { invitationCode },
  })
  useRedirect({ from: /.*/, to: "/", condition: Boolean(spaceKey) })

  const joinWithCode = async (invitationCode: string) => {
    const { space } = await shell.joinSpace({ invitationCode })
    if (space) {
      // Save our user info etc. to local storage
      update({ spaceKey: space.id, invitationCode: "" })

      await space.waitUntilReady()
      // build a contact for yourself
      const contact = create(Contact, {
        identityId: identity!.identityKey.toString(),
        avatarUrl: "",
        firstName: identity!.profile!.displayName!,
        lastName: "",
        userName: identity!.profile!.displayName!,
      })
      space.db.add(contact)
      navigate(`/`)
    } else {
      setError("Something went wrong... I don't know what")
    }
  }

  return invitationCode ?
      // Take invitation code from URL & confirm
      <InvitationForm
        heading="Join a team"
        error={error}
        invitationCode={invitationCode}
        readOnly={true}
        onSubmit={async () => joinWithCode(invitationCode)}
      /> // Show input for entering invitation code
    : <InvitationForm
        heading="Join a team"
        error={error}
        onSubmit={async ({ invitationCode: enteredInvitationCode }) =>
          joinWithCode(enteredInvitationCode)
        }
      />
}
