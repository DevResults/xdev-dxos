import * as AvatarPrimitive from "@radix-ui/react-avatar"
import * as React from "react"
import { cx } from "~/lib/cx"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & { size?: AvatarSize }
>(({ size = "md", className, ...props }, ref) => {
  const sizeStyle = sizeStyles[size]
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cx("relative flex shrink-0 overflow-hidden", sizeStyle, className)}
      {...props}
    />
  )
})
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cx("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    delayMs={500}
    className={cx(
      "flex h-full w-full items-center justify-center bg-neutral-400 font-black text-white",
      className,
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarFallback, AvatarImage }

const sizeStyles = {
  "2xs": "size-5 text-xs rounded-md",
  xs: "size-6 text-xs rounded-md",
  sm: "size-7 text-sm rounded-lg",
  md: "size-9 text-lg rounded-lg",
  lg: "size-12 text-2xl rounded-lg",
}

export type AvatarSize = keyof typeof sizeStyles
