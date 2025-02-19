import { useNavigate, useParams } from "react-router"
import { useShell } from "@dxos/react-client"
import { useState } from "react"
import { InvitationForm } from "./ui/InvitationForm"

export default function AuthLinkPage() {
  const navigate = useNavigate()
  const invitationCodeFromUrl = useParams().code
  const [error, setError] = useState<string | undefined>(undefined)
  const shell = useShell()

  // hooks ↑

  const joinWithCode = async (invitationCode: string) => {
    const { identity } = await shell.joinIdentity({ invitationCode })
    // do something with the identity? error handling?
    navigate("/")
  }

  return invitationCodeFromUrl ?
      <InvitationForm
        heading="Link a device"
        error={error}
        invitationCode={invitationCodeFromUrl}
        readOnly={true}
        onSubmit={async () => joinWithCode(invitationCodeFromUrl)}
      />
    : <InvitationForm
        heading="Link a device"
        error={error}
        onSubmit={async ({ invitationCode }) => joinWithCode(invitationCode)}
      />
}
