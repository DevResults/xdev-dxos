import { type LocalDate } from "@js-joda/core"
import { getSunday } from "~/lib/getSunday"

export function getWeek(date: LocalDate) {
  return {
    start: getSunday(date),
    end: getSunday(date).plusDays(6),
  }
}
