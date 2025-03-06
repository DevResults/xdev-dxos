import { create } from "@dxos/react-client/echo"
import { makeRandom } from "@herbcaudill/random"
import { type LocalDate } from "@js-joda/core"
import { dummyDones } from "data/dummyDones"
import type { Client } from "schema/Client"
import type { Contact, ContactId } from "schema/Contact"
import { type Project } from "schema/Project"
import { TimeEntry } from "schema/TimeEntry"
import { getWorkDays } from "./getWorkDays"
import { reconstructTimeEntryInput } from "./reconstructTimeEntryInput"

export function generateTimeEntries({
  contacts,
  projects,
  clients,
  startDate,
  weekCount,
  procrastinators = [],
  omit = [],
  seed = "1234",
}: Inputs) {
  const random = makeRandom(seed)
  const OUT = projects.find(d => d.code.toLowerCase() === "out")!
  const timeEntries: TimeEntry[] = []

  // Assign a timekeeping style to each contact
  const contactStyles = Object.fromEntries(
    contacts.map(c => {
      const procrastinates = procrastinators.includes(c.firstName) || random.probability(0.1)
      const weeksDelay = procrastinates ? random.integer(2, 4) : random.integer(0, 2)
      const gapProbability = procrastinates ? random.decimal(0.1, 0.3) : 0
      return [c.id, { weeksDelay, gapProbability }]
    }),
  )

  // Group workdays into weeks
  const workDays = getWorkDays(weekCount, startDate)
  const weeks = workDays.reduce<LocalDate[][]>((acc, date, i) => {
    const weekNum = Math.floor(i / 5)
    acc[weekNum] ||= []
    acc[weekNum].push(date)
    return acc
  }, [])

  const dayOff = (contactId: ContactId, date: LocalDate) => {
    const duration = 60 * 8
    return [
      create(TimeEntry, {
        contactId,
        date: date.toString(),
        project: OUT.id,
        duration,
        input: `Out ${duration}mins`,
        timestamp: Date.now().toString(),
      }),
    ]
  }

  const normalDay = (contactId: ContactId, date: LocalDate) => {
    const todaysTotal = random.integer(5.5, 8.5) * 60 // 5.5 - 8.5 hrs
    let totalDuration = 0

    const newEntries: TimeEntry[] = []

    while (totalDuration < todaysTotal) {
      const duration = Math.min(random.integer(1, 32) * 15, todaysTotal - totalDuration)
      const project = random.pick(projects)
      const maybeClient = project.requiresClient ? random.pick(clients) : undefined
      const description = random.probability(0.05) ? random.pick(dummyDones) : ""
      const input = reconstructTimeEntryInput({
        durationInHours: duration / 60,
        project: project.fullCode,
        client: maybeClient?.code,
        description,
      })
      newEntries.push(
        create(TimeEntry, {
          contactId,
          date: date.toString(),
          project: project.id,
          client: maybeClient?.id,
          duration,
          input,
          description,
          timestamp: Date.now().toString(),
        }),
      )
      totalDuration += duration
    }

    return newEntries
  }

  // For each contact, generate entries based on their style
  for (const contact of contacts) {
    if (omit.includes(contact.firstName)) continue

    const { weeksDelay, gapProbability } = contactStyles[contact.id]

    for (const week of weeks) {
      const procrastinating = weeks.indexOf(week) > weeks.length - weeksDelay // procrastinators will be missing recent weeks
      const recencyFalloff = 2 ** (weeks.indexOf(week) / weeks.length)
      const skipWeek = random.probability(gapProbability * recencyFalloff)
      if (skipWeek || procrastinating) continue

      for (const date of week) {
        const isDayOff = random.probability(0.15)
        const newEntries = isDayOff ? dayOff(contact.id, date) : normalDay(contact.id, date)
        timeEntries.push(...newEntries)
      }
    }
  }

  return timeEntries
}

type Inputs = {
  contacts: Contact[]
  projects: Project[]
  clients: Client[]
  startDate: LocalDate
  weekCount: number
  procrastinators?: string[]
  omit?: string[]
  seed?: string
}
