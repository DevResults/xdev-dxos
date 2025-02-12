import {
  charRange,
  choiceOf,
  digit,
  endOfString,
  lookahead,
  lookbehind,
  oneOrMore,
  startOfString,
  whitespace,
} from "ts-regex-builder"

export const startWord = lookbehind(choiceOf(startOfString, whitespace))
export const endWord = lookahead(choiceOf(endOfString, whitespace))
export const lowerCaseLetter = charRange("a", "z")
export const upperCaseLetter = charRange("A", "Z")
export const alphanumeric = choiceOf(lowerCaseLetter, upperCaseLetter, digit, "-")
export const number = oneOrMore(digit)
