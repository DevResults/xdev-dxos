import { useSignOut } from "hooks/useSignOut"
import { useState } from "react"
import { Signout } from "ui/Signout"

export default function SignOutPage() {
  const signOut = useSignOut()
  const [confirmed, setConfirmed] = useState(false)

  return (
    <Signout
      confirmed={confirmed}
      onConfirm={async () => {
        setConfirmed(true)
        await signOut()
      }}
    />
  )
}
