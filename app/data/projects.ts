import tailwindColors from "tailwindcss/colors"
import { unique } from "../lib/unique"
import { parseProjectCodes } from "./projectCodes"
import { makeFullCode, makeProject, type Project } from "~/schema/Project"

const projectList = parseProjectCodes()

const uniqueCodes = unique(projectList.map(p => p.code))

const colorNames: Array<keyof typeof tailwindColors> = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
]

export const colors = [
  ...colorNames.map(name => tailwindColors[name][500]),
  ...colorNames.map(name => tailwindColors[name][300]),
  ...colorNames.map(name => tailwindColors[name][800]),
]

/** Returns a color that is guaranteed to be (a) unique to this project code and (b) stable as more projects are added */
const codeColor = (code: string) => {
  const index = uniqueCodes.indexOf(code)
  return colors[index % colors.length]
}

const sNow = new Date().toISOString()

/** Plain project data for use in tests */
export const projects = projectList.map(({ code, subCode, requiresClient, description }) => ({
  id: `${code}-${subCode ?? ""}`.toLowerCase(),
  code,
  subCode,
  fullCode: makeFullCode(code, subCode),
  description,
  requiresClient,
  color: codeColor(code),
  timestamp: sNow,
})) as Project[]

/** Create DXOS project objects lazily to avoid issues during SSR/prerender */
export const createProjects = () => {
  return projectList.map(({ code, subCode, requiresClient, description }) =>
    makeProject({
      code,
      subCode,
      fullCode: makeFullCode(code, subCode),
      description,
      requiresClient,
      color: codeColor(code),
      timestamp: sNow,
    }),
  )
}
