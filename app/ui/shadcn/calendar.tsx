import { DayPicker } from "react-day-picker"
import { cx } from "~/lib/cx"

/** Styled wrapper around react-day-picker's DayPicker component. */
export function Calendar({
  className,
  classNames,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      className={cx("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center text-sm font-medium",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        button_previous: cx(
          "absolute left-1 top-0",
          "inline-flex items-center justify-center rounded-md",
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        button_next: cx(
          "absolute right-1 top-0",
          "inline-flex items-center justify-center rounded-md",
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        month_grid: "w-full border-collapse space-x-1",
        weekdays: "flex",
        weekday: "text-neutral-500 rounded-md w-8 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: cx(
          "relative p-0 text-center text-sm",
          "focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-primary-100",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          "[&:has([aria-selected].day-outside)]:bg-primary-100/50",
        ),
        day_button: cx(
          "inline-flex items-center justify-center rounded-md",
          "h-8 w-8 p-0 font-normal",
          "hover:bg-primary-100 hover:text-primary-900",
          "focus:outline-none focus:ring-2 focus:ring-primary-500",
          "aria-selected:opacity-100",
        ),
        range_end: "day-range-end",
        selected:
          "bg-primary-600 text-white hover:bg-primary-600 hover:text-white focus:bg-primary-600 focus:text-white",
        today: "bg-neutral-100 text-neutral-900",
        outside: "day-outside text-neutral-400 aria-selected:text-neutral-400/50",
        disabled: "text-neutral-400 opacity-50",
        range_middle: "aria-selected:bg-primary-100 aria-selected:text-primary-900",
        hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}
