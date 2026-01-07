import { DayOfWeek, type LocalDate } from "@js-joda/core"

/** Does the given date fall on a weekend? */
export function isWeekend(date: LocalDate) {
  const dayOfWeek = date.dayOfWeek()
  return dayOfWeek === DayOfWeek.SATURDAY || dayOfWeek === DayOfWeek.SUNDAY
}
