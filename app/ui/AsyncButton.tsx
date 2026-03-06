import { Button, type ButtonProps } from "@ui/button"

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
      <Button
        intent={intent}
        onClick={isRunning ? undefined : onClick}
        disabled={disabled && !isRunning}
        className={isRunning ? "cursor-not-allowed" : undefined}
        style={
          isRunning
            ? {
                background: `linear-gradient(to right, var(--color-danger-800) ${progress * 100}%, var(--color-danger-600) ${progress * 100}%)`,
              }
            : undefined
        }
      >
        {isRunning ? <IconLoader2 className="animate-spin" /> : null}
        {children}
      </Button>
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
