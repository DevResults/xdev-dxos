import { Card, CardContent, CardHeader } from "@ui/card"
import { Button } from "@ui/button"
import { cx } from "~/lib/cx"
import { Fragment } from "react/jsx-runtime"
import { Link } from "react-router"

export const SetupOptions = () => {
  const options = [
    {
      icon: <div className="-rotate-15 transform">💌</div>,
      label: "Have an invitation code?",
      buttonText: "Join a team",
      target: "/auth/setup/join",
    },
    {
      icon: <div className="rotate-12 transform">📱</div>,
      label: "Already joined on another device?",
      buttonText: "Link this device",
      target: "/auth/setup/link",
    },
    {
      icon: "🙋",
      label: "Starting something new?",
      buttonText: "Create a team",
      target: "/auth/setup/create",
    },
  ]

  return (
    <Card className="w-[40em]">
      <CardHeader />
      <CardContent
        className={cx([
          "flex flex-col content-center items-center gap-12",
          "sm:grid sm:max-w-full sm:grid-cols-3 sm:gap-0",
        ])}
      >
        {options.map(({ icon, label, buttonText, target }, i) => (
          <Fragment key={i}>
            <div className="row-span-3 grid w-full grid-rows-subgrid text-center">
              <div className="text-5xl">
                <div className="inline-block align-text-bottom">{icon}</div>
              </div>
              <div className="text-balance p-3 sm:p-5">{label}</div>
              <div className="sm:p-3">
                <Button asChild intent="primary" size="lg" className="h-full w-full justify-center">
                  <Link to={target}>{buttonText}</Link>
                </Button>
              </div>
            </div>
          </Fragment>
        ))}
      </CardContent>
    </Card>
  )
}
