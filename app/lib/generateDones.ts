import { create } from "@dxos/react-client/echo"
import type { LocalDate } from "@js-joda/core"
import { dummyDones } from "data/dummyDones"
import { isWeekend } from "lib/isWeekend"
import { randomElement } from "lib/randomElement"
import type { Contact } from "schema/Contact"
import { DoneEntry } from "schema/DoneEntry"

export const generateDones = ({ today, weeks, productivity, enthusiasm, contacts }: params) => {
  const N = weeks * 7 * productivity * contacts.length
  const result: DoneEntry[] = []
  let percentComplete = 0
  for (let i = 0; i < N; i++) {
    const currentPercentComplete = Math.floor((i / N) * 10) * 10
    if (currentPercentComplete > percentComplete) {
      percentComplete = currentPercentComplete
    }

    const { id } = randomElement(contacts)
    const date = getRandomWorkday(today, weeks)
    const content = randomElement(dummyDones)
    const likes = contacts.filter(() => Math.random() < enthusiasm).map(({ id }) => id)
    result.push(
      create(DoneEntry, {
        content,
        date: date.toString(),
        contactId: id,
        likes,
        timestamp: Date.now().toString(),
      }),
    )
  }

  return result
}

type params = {
  today: LocalDate
  weeks: number
  productivity: number
  enthusiasm: number
  contacts: Contact[]
}

/** choose a random workday in the last n weeks */
export const getRandomWorkday = (today: LocalDate, weeks: number): LocalDate => {
  const days = weeks * 7
  const date = today.minusDays(Math.floor(Math.random() * days))
  return isWeekend(date) ? getRandomWorkday(today, weeks) : date
}
