import { Context } from "./lib/Effect";

export class ProvidedProjects extends Context.Tag("ProvidedProjects")<ProvidedProjects, string[]>() {}
