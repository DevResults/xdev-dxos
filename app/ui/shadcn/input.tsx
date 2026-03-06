import * as React from "react"
import { cx } from "~/lib/cx"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cx(
        "flex w-full rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-neutral-500",
        "ring-1 ring-inset ring-white/10 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
Input.displayName = "Input"

export { Input }
