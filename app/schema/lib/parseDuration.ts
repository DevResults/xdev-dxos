import {
  buildRegExp,
  capture,
  choiceOf,
  endOfString,
  optional,
  startOfString,
} from "ts-regex-builder"
import { E, Data } from "./Effect"
import { number } from "./regex"

/** Finds and parses a duration, expressed in decimal or hours:minutes, from inside a string of text */
export const parseDuration = (input: string) => {
  // Use ts-regex-builder to build regexes that match the various formats of durations
  const HR = choiceOf("hrs", "hr", "h")
  const MIN = choiceOf("mins", "min", "mn", "m")
  const formats = [
    // 2.15, .25, 2.15hrs
    [
      optional([capture(number, { name: "hrs" })]), //
      ":",
      capture(number, { name: "mins" }),
    ],

    // 1h, 2hrs, 1h45, 1h45m
    [
      capture(number, { name: "hrs" }),
      HR,
      optional([capture(number, { name: "mins" }), optional(MIN)]),
    ],

    // 45m, 45min
    [
      capture(number, { name: "mins" }), //
      MIN,
    ],

    // 2.5, .25, 2.5hrs
    [
      capture([optional(number), ".", number], { name: "hrsDecimal" }), //
      optional(HR),
    ],
  ].map(f => buildRegExp([startOfString, ...f, endOfString], { ignoreCase: true }))

  // Break the input into words and look for matches against each format
  const results = input
    .split(/\s+/)
    .map(word => {
      for (const format of formats) {
        const match = word.match(format)
        if (match) {
          const text = match[0]
          const { hrs = "0", mins = "0", hrsDecimal } = match.groups!

          const duration =
            hrsDecimal ?
              Math.round(Number(hrsDecimal) * 60) // Decimal (e.g. 2.5)
            : Number(hrs) * 60 + Number(mins) // Hours+minutes (e.g. 2:30)

          // Only return this if we got a valid non-zero number
          if (duration > 0 && !Number.isNaN(duration)) {
            return { text, duration }
          }
        }
      }

      return undefined
    })
    .filter(r => r !== undefined)

  if (results.length > 1) {
    return E.fail(new MultipleDurationsError({ input }))
  }

  if (results.length === 0) {
    return E.fail(new NoDurationError({ input }))
  }

  return E.succeed(results[0])
}

export class MultipleDurationsError //
  extends (new Data.TaggedError("parseDuration/MultipleDurations"))<{ input: string }>
{
  message = "More than one duration was found."
}

export class NoDurationError //
  extends (new Data.TaggedError("parseDuration/NoDuration"))<{ input: string }>
{
  message = "No duration found."
}
