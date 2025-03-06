import { Link, useLocation } from "react-router"
import { useNavigationHotkey } from "~/hooks/useNavigationHotkey"
import { useRedirect } from "~/hooks/useRedirect"
import { useSelectedYear } from "~/hooks/useSelectedYear"
import { cx } from "~/lib/cx"
import { getCurrentYear } from "~/lib/getCurrentYear"

const currentYear = getCurrentYear()

export const YearNav = ({
  minYear = Number.NEGATIVE_INFINITY,
  maxYear = Number.POSITIVE_INFINITY,
}: Props) => {
  const { pathname } = useLocation()

  const changeYearTo = (newYear: number) => pathname.replace(String(year), String(newYear))

  const year = useSelectedYear()
  useRedirect({ from: pathname, to: changeYearTo(maxYear), condition: year > maxYear })
  useRedirect({ from: pathname, to: changeYearTo(minYear), condition: year < minYear })

  const canGoPrev = year > minYear
  const canGoNext = year < maxYear

  const current = pathname.replace(String(year), String(currentYear))
  const prev = canGoPrev ? changeYearTo(year - 1) : ""
  const next = canGoNext ? changeYearTo(year + 1) : ""

  useNavigationHotkey("t", current)
  useNavigationHotkey("p,j,pageup", prev)
  useNavigationHotkey("n,k,pagedown", next)

  return (
    <div className="flex flex-row items-center gap-2">
      <span className="mx-2 whitespace-nowrap font-serif tracking-tight">{year}</span>
      <div className="flex flex-row items-center gap-2 rounded-lg border">
        <Link
          className={cx("border-r px-3 py-1", !canGoPrev && "cursor-default text-neutral-100")}
          title={canGoPrev ? "Previous year (p)" : ""}
          relative="path"
          to={prev}
          children={<IconCaretLeftFilled className="size-4" />}
          aria-disabled={!canGoPrev}
        />
        <Link
          className={cx("border-r px-3 py-1")}
          title="This year (t)"
          relative="path"
          to={current}
          children={<IconCalendarDue className="size-4" />}
        />

        <Link
          title={canGoNext ? "Next year (n)" : ""}
          className={cx("px-3 py-1", !canGoNext && "cursor-default text-neutral-100")}
          relative="path"
          to={next}
          children={<IconCaretRightFilled className="size-4" />}
          aria-disabled={!canGoNext}
        />
      </div>
    </div>
  )
}

type Props = {
  minYear?: number
  maxYear?: number
}
