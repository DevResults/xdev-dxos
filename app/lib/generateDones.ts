import type { LocalDate } from "@js-joda/core"
import { isWeekend } from "lib/isWeekend"
import type { Contact } from "schema/Contact"
import { type DoneEntryEncoded } from "schema/DoneEntry"
import { dummyDones } from "./dummyDones"
import { randomElement } from "./randomElement"

export const generateDones = ({ today, weeks, productivity, enthusiasm, contacts }: parameters) => {
  const N = weeks * 7 * productivity * contacts.length
  const result: Array<Omit<DoneEntryEncoded, "id">> = []
  const now = Date.now()
  let percentComplete = 0
  for (let i = 0; i < N; i++) {
    const currentPercentComplete = Math.floor((i / N) * 10) * 10
    if (currentPercentComplete > percentComplete) {
      percentComplete = currentPercentComplete
    }

    const { id } = randomElement(contacts)
    const date = getRandomWorkday(today, weeks)
    const content = randomElement(dummyDones)
    const likes = contacts
      .filter(() => Math.random() < enthusiasm)
      .map(({ id: contactId }) => contactId)
    result.push({
      content,
      date: date.toString(),
      contactId: id,
      likes,
      timestamp: now,
    })
  }

  return result
}

type parameters = {
  today: LocalDate
  weeks: number
  productivity: number
  enthusiasm: number
  contacts: Contact[]
}

/** Choose a random workday in the last n weeks */
export const getRandomWorkday = (today: LocalDate, weeks: number): LocalDate => {
  const days = weeks * 7
  const date = today.minusDays(Math.floor(Math.random() * days))
  return isWeekend(date) ? getRandomWorkday(today, weeks) : date
}
