import { useSignOut } from "hooks/useSignOut"
import { Signout } from "ui/Signout"

export default function SignOutPage() {
  const signOut = useSignOut()

  return (
    <Signout
      onConfirm={() => {
        // Fire signOut without awaiting — client.reset() communicates with the
        // SharedWorker and may hang, which would prevent the redirect from firing.
        // The hard reload will cause DXOS to re-initialize from scratch.
        void signOut()
        window.location.href = "/"
      }}
    />
  )
}
