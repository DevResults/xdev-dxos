import { LocalDate, TemporalAdjusters, DayOfWeek } from "@js-joda/core"

// HELPERS
export const getSundaysForYear = (year: number) => {
  const firstSunday = LocalDate.of(year, 1, 1).with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY))

  const sundays = []
  for (let d = firstSunday; d.year() === year; d = d.plusWeeks(1)) {
    sundays.push(d)
  }

  return sundays
}
