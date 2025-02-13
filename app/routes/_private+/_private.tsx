import { useIdentity } from "@dxos/react-client/halo"
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router"
import { useTeam } from "~/hooks/useTeam"
import { AppLayout } from "~/ui/layouts/AppLayout"
import { Loading } from "~/ui/Loading"

export default function Private() {
  const identity = useIdentity()
  const { self } = useTeam()
  const navigate = useNavigate()

  useEffect(() => {
    if (!identity) navigate("/auth/begin")
  }, [identity, navigate])
  return self ?
      <AppLayout self={self}>
        <Outlet />
      </AppLayout>
    : <Loading />
}
