import { projects } from "data/projects"
import { runTestCases, type BaseTestCase } from "lib/runTestCases"
import { ProvidedProjects } from "schema/ProjectCollection"
import { describe, expect } from "vitest"
import { parseProject } from "../parseProject"
import { E, pipe } from "~/schema/lib/Effect"

describe("parseProject", () => {
  runTestCases({
    testCases: [
      // INVALID

      { input: "", error: "NoProject" }, // empty
      { input: "Support", error: "NoProject" }, // no #
      { input: "#Support", error: "CodeNotFound" }, // no subcode
      { input: "Ongoing", error: "NoProject" }, // no #
      { input: "#Supppport: Ongoing", error: "CodeNotFound" }, // typo
      { input: "#DevOps: Azure migration", error: "CodeNotFound" }, // multiple words need to be separated by dashes
      { input: "#API", error: "AmbiguousProjectCode" }, // multiple subcode matches
      { input: "#Out #Overhead", error: "MultipleProjects" },

      // VALID

      { input: "#Support: Ongoing", code: "Support", subCode: "Ongoing" }, // one space after colon
      { input: "#Support:Ongoing", code: "Support", subCode: "Ongoing" }, // no space
      { input: "#Support:    Ongoing", code: "Support", subCode: "Ongoing" }, // multiple spaces

      { input: "#DevOps: Azure-migration", code: "DevOps", subCode: "Azure-migration" }, // multiple words need to be separated by dashes

      { input: "#Feature: API", code: "Feature", subCode: "API", text: "#Feature: API" },

      { input: "1h #Ongoing", code: "Support", subCode: "Ongoing", text: "#Ongoing" },
      { input: "1h #onGoiNG", code: "Support", subCode: "Ongoing", text: "#onGoiNG" }, // case doesn't matter

      { input: "8h #out vacation day", code: "Out", text: "#out" },
    ] as TestCase[],

    decoder: (input: string) =>
      pipe(
        input, //
        parseProject,
        E.provideService(ProvidedProjects, projects),
      ),

    validate(expected, actual) {
      expect(actual.project.code).toEqual(expected.code)
      expect(actual.project.subCode).toEqual(expected.subCode)
      if (expected.text) expect(actual.text).toEqual(expected.text)
    },
  })
})

type TestCase = BaseTestCase & {
  code?: string
  subCode?: string
  text?: string
}
