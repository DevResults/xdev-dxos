import { DayOfWeek, LocalDate, TemporalAdjusters } from "@js-joda/core"

const { previousOrSame } = TemporalAdjusters
const { SUNDAY } = DayOfWeek

export const getSunday = (d: LocalDate = LocalDate.now()) => d.with(previousOrSame(SUNDAY))
