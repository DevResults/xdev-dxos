import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cx } from "~/lib/cx";
import * as React from "react";

const buttonVariants = cva(
  [
    "inline-flex gap-1 items-center justify-center rounded-lg leading-tight whitespace-nowrap",
    "font-medium",
    "transition-all",
    "focus:outline-none focus:ring-2 focus:ring-offset-1",
    "disabled:opacity-40",
  ],
  {
    variants: {
      intent: {
        primary: ["bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white"],
        neutral: ["bg-white hover:bg-neutral-50 focus:ring-neutral-300 text-neutral-700 border border-neutral-300"],
        danger: ["bg-danger-600 hover:bg-danger-700 focus:ring-danger-500 text-white"],
        success: ["bg-success-600 hover:bg-success-700 focus:ring-success-500 text-white"],
      },
      size: {
        xs: ["text-xs px-2 py-1"],
        sm: ["text-sm px-4 py-1"],
        md: ["text-sm px-5 py-3"],
        lg: ["text-base px-6 py-3"],
      },
    },
    defaultVariants: {
      intent: "neutral",
      size: "sm",
    },
  }
);

export type ButtonProps = {
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cx(buttonVariants({ intent, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
