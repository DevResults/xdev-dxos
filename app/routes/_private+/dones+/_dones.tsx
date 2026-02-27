import { useRedirect } from "hooks/useRedirect"
import { getSunday } from "lib/getSunday"
import { Outlet } from "react-router"

const currentWeek = getSunday().toString()

export default function DonesLayout() {
  useRedirect({ from: "/dones", to: `/dones/${currentWeek}` })
  return <Outlet />
}
