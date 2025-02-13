import { cva, type VariantProps } from "class-variance-authority"
import { cx } from "~/lib/cx"
import * as React from "react"

const alertVariants = cva(
  cx(
    "relative w-full rounded-lg border p-4",
    "[&>svg~*]:pl-7",
    "[&>svg+div]:translate-y-[-3px]",
    "[&>svg]:absolute [&>svg]:text-xl [&>svg]:left-3 [&>svg]:top-3",
  ),
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        danger: "border-danger/50 text-danger dark:border-danger [&>svg]:text-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cx(alertVariants({ variant }), className)} {...props} />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cx("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  ),
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cx("mt-px text-sm [&_p]:leading-relaxed", className)} {...props} />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
