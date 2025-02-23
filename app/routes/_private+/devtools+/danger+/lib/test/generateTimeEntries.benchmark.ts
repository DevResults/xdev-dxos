import { LocalDate } from "@js-joda/core"
import { clients } from "data/clients"
import { projects } from "data/projects"
import { bench } from "vitest"
import { generateTimeEntries } from "../generateTimeEntries"
import type { Contact } from "~/schema/Contact"

const contacts = [{ id: "herb" }, { id: "leslie" }, { id: "brent" }] as Contact[]

const doWork = (years: number) => {
  generateTimeEntries({
    clients,
    contacts,
    projects,
    startDate: LocalDate.now(),
    weekCount: 52 * years,
  })
}

bench("1 year", async () => doWork(1))
bench("5 years", async () => doWork(5))
// bench("10 years", async () => doWork(10))
// bench("20 years", async () => doWork(20))
