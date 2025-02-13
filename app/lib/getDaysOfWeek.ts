import { type LocalDate } from "@js-joda/core"
import { getSunday } from "./getSunday"
import { range } from "./range"

export const getDaysOfWeek = (firstDayOfWeek: LocalDate = getSunday()) =>
  range(0, 6).map(i => firstDayOfWeek.plusDays(i))
