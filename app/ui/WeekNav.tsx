import { Link, useLocation, useParams } from "react-router"
import { useNavigationHotkey } from "~/hooks/useNavigationHotkey"
import { useSelectedWeek } from "~/hooks/useSelectedWeek"
import { formatDateRange } from "~/lib/formatDateRange"
import { getSunday } from "~/lib/getSunday"

export const WeekNav = () => {
  const { start, end } = useSelectedWeek()

  const { pathname } = useLocation()
  const { date = "" } = useParams()

  const current = pathname.replace(date, getSunday().toString())
  const previous = pathname.replace(date, start.minusWeeks(1).toString())
  const next = pathname.replace(date, start.plusWeeks(1).toString())

  useNavigationHotkey("t", current)
  useNavigationHotkey("p,j,pageup", previous)
  useNavigationHotkey("n,k,pagedown", next)

  return (
    <div className="flex flex-row items-center gap-2">
      <span className="whitespace-nowrap font-serif tracking-tight">
        {formatDateRange(start, end)}
      </span>

      <div className="flex flex-row items-center gap-2 rounded-lg border">
        <Link
          className="border-r px-3 py-1"
          title="Previous week (p)"
          relative="path"
          to={previous}
          children={<IconCaretLeftFilled className="size-4" />}
        />
        <Link
          className="border-r px-3 py-1"
          title="Today (t)"
          relative="path"
          to={current}
          children={<IconCalendarDue className="size-4" />}
        />
        <Link
          className="px-3 py-1"
          title="Next week (n)" //
          relative="path"
          to={next}
          children={<IconCaretRightFilled className="size-4" />}
        />
      </div>
    </div>
  )
}
