import { Button, type ButtonProps } from "@ui/button"
import { cx } from "~/lib/cx"

/** A button with built-in spinner, progress bar, and success message for long-running operations. */
export const AsyncButton = ({
  onClick,
  disabled,
  isRunning,
  progress,
  result,
  intent = "danger",
  children,
}: Props) => {
  return (
    <div className="py-4">
      <Button intent={intent} onClick={onClick} disabled={disabled || isRunning}>
        {isRunning ? <IconLoader2 className="animate-spin" /> : null}
        {children}
      </Button>
      {isRunning ? (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className={cx(
              "h-full rounded-full bg-danger-500",
              progress > 0 ? "transition-all duration-150" : "animate-pulse bg-danger-300",
            )}
            style={{ width: progress > 0 ? `${Math.round(progress * 100)}%` : "100%" }}
          />
        </div>
      ) : null}
      {result ? (
        <div className="mt-2 flex flex-row items-center gap-2 text-sm">
          <IconCircleCheckFilled className="text-lg text-success" />
          {result}
        </div>
      ) : null}
    </div>
  )
}

type Props = {
  onClick: () => void
  disabled?: boolean
  isRunning: boolean
  progress: number
  result?: string
  intent?: ButtonProps["intent"]
  children: React.ReactNode
}
