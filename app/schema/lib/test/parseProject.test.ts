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

      { input: "", error: "NoProject" }, // Empty
      { input: "Support", error: "NoProject" }, // No #
      { input: "#Support", error: "CodeNotFound" }, // No subcode
      { input: "Ongoing", error: "NoProject" }, // No #
      { input: "#Supppport: Ongoing", error: "CodeNotFound" }, // Typo
      { input: "#DevOps: Azure migration", error: "CodeNotFound" }, // Multiple words need to be separated by dashes
      { input: "#API", error: "AmbiguousProjectCode" }, // Multiple subcode matches
      { input: "#Out #Overhead", error: "MultipleProjects" },

      // VALID

      { input: "#Support: Ongoing", code: "Support", subCode: "Ongoing" }, // One space after colon
      { input: "#Support:Ongoing", code: "Support", subCode: "Ongoing" }, // No space
      { input: "#Support:    Ongoing", code: "Support", subCode: "Ongoing" }, // Multiple spaces

      { input: "#DevOps: Azure-migration", code: "DevOps", subCode: "Azure-migration" }, // Multiple words need to be separated by dashes

      {
        input: "#Feature: API",
        code: "Feature",
        subCode: "API",
        text: "#Feature: API",
      },

      {
        input: "1h #Ongoing",
        code: "Support",
        subCode: "Ongoing",
        text: "#Ongoing",
      },
      {
        input: "1h #onGoiNG",
        code: "Support",
        subCode: "Ongoing",
        text: "#onGoiNG",
      }, // Case doesn't matter

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
      if (expected.text) {
        expect(actual.text).toEqual(expected.text)
      }
    },
  })
})

type TestCase = BaseTestCase & {
  code?: string
  subCode?: string
  text?: string
}
