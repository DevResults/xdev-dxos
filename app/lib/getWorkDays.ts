import { DayOfWeek, LocalDate } from "@js-joda/core"
import { getSunday } from "~/lib/getSunday"
import { isWeekend } from "~/lib/isWeekend"

export function getWorkDays(weekCount: number, startDate: LocalDate = LocalDate.now()) {
  let weeks = 0
  const dates = []
  let date = getSunday(startDate)
  while (weeks < weekCount) {
    date = date.plusDays(1)
    if (!isWeekend(date)) {
      dates.push(date)
    }

    if (date.dayOfWeek() === DayOfWeek.SATURDAY) {
      weeks++
    }
  }

  return dates
}
