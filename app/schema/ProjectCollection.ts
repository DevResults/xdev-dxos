import { Context } from "./lib/Effect";
import type { Project } from "./Project";

export class ProvidedProjects extends Context.Tag("ProvidedProjects")<ProvidedProjects, Project[]>() {}
