import { useSignOut } from "hooks/useSignOut"
import { Signout } from "ui/Signout"

export default function SignOutPage() {
  const signOut = useSignOut()

  return (
    <Signout
      onConfirm={async () => {
        await signOut()
        window.location.href = "/"
      }}
    />
  )
}
