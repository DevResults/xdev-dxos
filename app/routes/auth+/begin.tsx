import { useClient } from "@dxos/react-client"
import { useIdentity } from "@dxos/react-client/halo"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { UserNameForm } from "ui/UserNameForm"

export default function Begin() {
  const identity = useIdentity()
  const client = useClient()
  const navigate = useNavigate()

  useEffect(() => {
    if (identity?.profile?.displayName) {
      void navigate("/auth/setup")
    }
  }, [identity, navigate])

  return (
    <UserNameForm
      userName=""
      onSubmit={async ({ n: userName }) => {
        await (identity
          ? client.halo.updateProfile({ displayName: userName })
          : client.halo.createIdentity({ displayName: userName }))
      }}
    />
  )
}
