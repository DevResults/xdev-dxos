import { Outlet } from "react-router"
import { useRedirect } from "~/hooks/useRedirect"
import { getSunday } from "~/lib/getSunday"

const currentWeek = getSunday().toString()

export default function DonesLayout() {
  useRedirect({ from: "/dones", to: `/dones/${currentWeek}` })
  return <Outlet />
}
