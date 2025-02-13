import { useClient } from "@dxos/react-client"
import { useIdentity } from "@dxos/react-client/halo"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { UserNameForm } from "./ui/UserNameForm"

export default function Begin() {
  const identity = useIdentity()
  const client = useClient()
  const navigate = useNavigate()

  useEffect(() => {
    if (identity?.profile?.displayName) {
      navigate("/auth/setup")
    }
  }, [identity, navigate])

  return (
    <UserNameForm
      userName=""
      onSubmit={async ({ n: userName }) => {
        if (identity) {
          await client.halo.updateProfile({ displayName: userName })
        } else {
          await client.halo.createIdentity({ displayName: userName })
        }
      }}
    />
  )
}
