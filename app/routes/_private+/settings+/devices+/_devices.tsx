import { type PublicKey, useShell } from "@dxos/react-client"
import { Device, DeviceKind } from "@dxos/react-client/halo"
import { Outlet } from "react-router"
import { Devices } from "ui/Devices"
import { Pane } from "ui/layouts/Pane"
import { useTeam } from "~/hooks/useTeam"

export default function DevicesPage() {
  const { device, devices } = useTeam()
  const shell = useShell()
  return (
    <Pane>
      <Devices
        ownDevice={device ?? emptyDevice}
        devices={devices ?? []}
        onInvite={async () => {
          await shell.shareIdentity()
        }}
      />
      {/* Outlet for dialogs */}
      <Outlet />
    </Pane>
  )
}

const emptyDevice = {
  deviceKey: "" as unknown as PublicKey,
  kind: DeviceKind.CURRENT,
  presence: Device.PresenceState.ONLINE,
}
