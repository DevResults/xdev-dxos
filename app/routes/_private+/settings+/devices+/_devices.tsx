import { Outlet } from "react-router"
import { Devices } from "./ui/Devices"
import { useTeam } from "~/hooks/useTeam"

export default function DevicesPage() {
  const { device, devices } = useTeam()
  return (
    <>
      <Devices ownDevice={device} devices={devices ?? []} />
      {/* Outlet for dialogs */}
      <Outlet />
    </>
  )
}
