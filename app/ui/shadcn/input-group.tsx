import * as React from "react"
import { cx } from "~/lib/cx"
import { Input } from "~/ui/shadcn/input"

/** A wrapper that groups an input with inline addons (icons, buttons, text). */
function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cx(
        "shadow-xs relative flex w-full items-center rounded-md border border-neutral-200 bg-white",
        "min-w-0",
        "ring-1 ring-inset ring-white/10",
        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-1 has-[[data-slot=input-group-control]:focus-visible]:ring-inset has-[[data-slot=input-group-control]:focus-visible]:ring-primary-500",
        className,
      )}
      {...props}
    />
  )
}

/** A container for icons, text, or buttons placed alongside an input. */
function InputGroupAddon({
  className,
  align = "inline-end",
  ...props
}: React.ComponentProps<"div"> & { align?: "inline-start" | "inline-end" }) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      className={cx(
        "flex items-center justify-center text-neutral-400 [&>svg:not([class*='size-'])]:size-4",
        align === "inline-start" && "order-first pl-3",
        align === "inline-end" && "order-last pr-3",
        className,
      )}
      onClick={e => {
        if ((e.target as HTMLElement).closest("button")) return
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

/** An input styled to sit inside an InputGroup (no border or shadow of its own). */
const InputGroupInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      data-slot="input-group-control"
      className={cx(
        "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 focus-visible:outline-none outline-none",
        className,
      )}
      {...props}
    />
  ),
)

export { InputGroup, InputGroupAddon, InputGroupInput }
