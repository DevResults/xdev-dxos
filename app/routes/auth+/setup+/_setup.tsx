import { useIdentity } from "@dxos/react-client/halo"
import { SetupOptions } from "ui/SetupOptions"
import { useLocalState } from "~/hooks/useLocalState"
import { useRedirect } from "~/hooks/useRedirect"

export default function Setup() {
  const identity = useIdentity()
  const { invitationCode, spaceKey } = useLocalState()

  const identityConfigured = Boolean(identity?.profile?.displayName)

  useRedirect({ from: "/auth/setup", to: "/auth/begin", condition: !identityConfigured })
  useRedirect({
    from: "/auth/setup",
    to: `/auth/setup/join/${invitationCode}`,
    condition: identityConfigured && Boolean(invitationCode),
  })
  useRedirect({ from: "/auth/setup", to: "/", condition: Boolean(identity) && Boolean(spaceKey) })

  return <SetupOptions />
}
