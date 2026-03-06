import { Button, type ButtonProps } from "@ui/button"

/** A button with built-in spinner, progress bar, and success message for long-running operations. */
export const AsyncButton = ({
  onClick,
  disabled,
  isRunning,
  progress,
  result,
  error,
  intent = "danger",
  children,
}: Props) => {
  return (
    <div className="py-4">
      <Button
        intent={intent}
        onClick={isRunning ? undefined : onClick}
        disabled={disabled && !isRunning}
        className={
          isRunning ? "relative cursor-not-allowed overflow-hidden" : "relative overflow-hidden"
        }
      >
        {isRunning ? (
          <div
            className="absolute inset-0 bg-black/20 transition-all duration-150"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        ) : null}
        <span className="relative flex items-center gap-1">
          {isRunning ? <IconLoader2 className="animate-spin" /> : null}
          {children}
        </span>
      </Button>
      {error ? (
        <div className="mt-2 flex flex-row items-center gap-2 text-sm text-danger-600">
          <IconExclamationCircleFilled className="text-lg" />
          {error}
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
  result: string | undefined
  error: string | undefined
  intent?: ButtonProps["intent"]
  children: React.ReactNode
}
