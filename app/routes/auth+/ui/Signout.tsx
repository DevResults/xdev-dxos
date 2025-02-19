import { Button } from "@ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/card"
import { Link } from "react-router"

export const Signout = ({ confirmed = false, onConfirm = () => {} }: Props) => {
  const warning = (
    <Card className="w-full max-w-lg overflow-clip border-danger-700">
      <CardHeader className="bg-danger-700">
        <CardTitle className="flex flex-row items-center text-white">
          <div className="flex-shrink-0">
            <IconExclamationCircle className="size-12" aria-hidden="true" />
          </div>
          <div className="ml-3">Sign out?</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="my-8 flex flex-col gap-2">
          <p>All team data will be removed from this device.</p>
          <p>
            If you want to use XDev again on this device, you'll need to reauthorize it from another
            device, or be re-invited to the team.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <>
          <Button asChild size="md">
            <Link to="/">No, go back</Link>
          </Button>
          <span className="grow" />
          <Button size="md" intent="danger" onClick={onConfirm}>
            Yes, sign out
          </Button>
        </>
      </CardFooter>
    </Card>
  )
  const confirmation = (
    <Card className="w-full max-w-xs">
      <CardHeader className="text-center">You've been signed out.</CardHeader>
      <CardFooter className="justify-center">
        <Button asChild size="md" intent="primary">
          <Link to="/">Sign in again</Link>
        </Button>
      </CardFooter>
    </Card>
  )
  return confirmed ? confirmation : warning
}

type Props = {
  confirmed?: boolean
  onConfirm?: () => void
}
