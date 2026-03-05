import { LocalDate } from "@js-joda/core"
import { clients } from "data/clients"
import { contacts } from "data/contacts"
import { projects } from "data/projects"
import { describe, expect, test } from "vitest"
import { generateTimeEntries } from "../generateTimeEntries"

describe("generateTimeEntries", () => {
  test("generates 1 week of data for 1 contact", () => {
    const entries = generateTimeEntries({
      clients,
      contacts: contacts.slice(0, 1),
      projects,
      startDate: LocalDate.now(),
      weekCount: 1,
    })
    const days = new Set(entries.map(d => d.date))

    expect(days).toHaveLength(5)
    const distinctContacts = new Set(entries.map(d => d.contactId))

    expect(distinctContacts).toHaveLength(1)
    const totalHours = Math.ceil(entries.reduce((total, entry) => total + entry.duration, 0))
    expect(totalHours).toBeGreaterThanOrEqual(
      60 * // Mins per hour
        5.5 * // Hours per day (lower bound in generator)
        5 * // Days per week
        1 * // Weeks
        1, // Contacts
    )
  })

  test("generates 6 weeks of data for 5 contacts", () => {
    const entries = generateTimeEntries({
      clients,
      contacts: contacts.slice(0, 5),
      projects,
      startDate: LocalDate.now(),
      weekCount: 6,
    })
    const days = new Set(entries.map(d => d.date))
    expect(days).toHaveLength(30)
    const distinctContacts = new Set(entries.map(d => d.contactId))
    expect(distinctContacts).toHaveLength(5)
    const totalMins = Math.ceil(entries.reduce((total, entry) => total + entry.duration, 0))
    expect(totalMins).toBeGreaterThanOrEqual(
      60 * // Mins per hour
        5.5 * // Hours per day (lower bound in generator)
        5 * // Days per week
        6 * // Weeks
        5, // Contacts
    )
  })

  test("generates 104 weeks of data for all contacts", () => {
    const entries = generateTimeEntries({
      clients,
      contacts,
      projects,
      startDate: LocalDate.now(),
      weekCount: 104,
    })
    const days = new Set(entries.map(d => d.date))
    expect(days).toHaveLength(520)
    const distinctContacts = new Set(entries.map(d => d.contactId))
    expect(distinctContacts).toHaveLength(contacts.length)
    const totalMins = Math.ceil(entries.reduce((total, entry) => total + entry.duration, 0))
    expect(totalMins).toBeGreaterThanOrEqual(
      60 * // Mins per hour
        5.5 * // Hours per day (lower bound in generator)
        5 * // Days per week
        104 * // Weeks
        contacts.length, // Contacts
    )
  })
})
