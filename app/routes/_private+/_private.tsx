import { useSpace, HaloSpaceMember } from "@dxos/react-client/echo"
import { useIdentity } from "@dxos/react-client/halo"
import { useSignOut } from "hooks/useSignOut"
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router"
import { useLocalState } from "~/hooks/useLocalState"
import { useTeam } from "~/hooks/useTeam"
import { AppLayout } from "~/ui/layouts/AppLayout"
import { Loading } from "~/ui/Loading"

export default function Private() {
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)
  const identity = useIdentity()
  const { self } = useTeam()
  const navigate = useNavigate()
  const signOut = useSignOut()

  useEffect(() => {
    if (!identity) {
      void navigate("/auth/begin")
    }
  }, [identity, navigate])

  useEffect(() => {
    const members = space?.members.get()
    if (!self && identity && members) {
      const member = members.find(
        d => d.identity.identityKey.toString() === identity.identityKey.toString(),
      )
      if (member?.role === HaloSpaceMember.Role.REMOVED) {
        ;(async () => {
          await signOut()
          void navigate("/")
        })()
      }
    }
  }, [self, space, identity, signOut, navigate])

  return self ? (
    <AppLayout self={self}>
      <Outlet />
    </AppLayout>
  ) : (
    <Loading />
  )
}
