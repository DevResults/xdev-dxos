const MIN_HOURS_PER_WEEK = 30

/**
 * Returns `true` if duration (in minutes) meets the minimum threshhold to mark an individual's hour
 * reporting as complete for the week.
 */
export function isCompleteWeek(durationMins: number) {
  return durationMins >= 60 * MIN_HOURS_PER_WEEK
}
