import { Outlet } from "react-router"
import { type PublicKey, useShell } from "@dxos/react-client"
import { Device, DeviceKind } from "@dxos/react-client/halo"
import { Devices } from "./ui/Devices"
import { useTeam } from "~/hooks/useTeam"

export default function DevicesPage() {
  const { device, devices } = useTeam()
  const shell = useShell()
  return (
    <>
      <Devices
        ownDevice={device ?? emptyDevice}
        devices={devices ?? []}
        onInvite={async () => {
          await shell.shareIdentity()
        }}
      />
      {/* Outlet for dialogs */}
      <Outlet />
    </>
  )
}

const emptyDevice = {
  deviceKey: "" as unknown as PublicKey,
  kind: DeviceKind.CURRENT,
  presence: Device.PresenceState.ONLINE,
}
