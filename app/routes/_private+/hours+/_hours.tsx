import { Outlet } from "react-router"
import { useRedirect } from "~/hooks/useRedirect"
import { getCurrentYear } from "~/lib/getCurrentYear"

export default function HoursLayout() {
  useRedirect({ from: "/hours", to: `/hours/${getCurrentYear()}` })
  return <Outlet />
}
