import { Outlet } from "react-router"
import { useRedirect } from "~/hooks/useRedirect"
import { getSunday } from "~/lib/getSunday"

const currentWeek = getSunday().toString()

export default function MyWeekLayout() {
  useRedirect({ from: "/myweek", to: `/myweek/${currentWeek}` })
  return <Outlet />
}
