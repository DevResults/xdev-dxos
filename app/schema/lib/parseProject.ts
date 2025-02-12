import { Data, E } from "./Effect";
import { alphanumeric, endWord, startWord } from "./regex";
import { ProvidedProjects } from "../ProjectCollection";
import { buildRegExp, capture, choiceOf, oneOrMore, optional, whitespace, zeroOrMore } from "ts-regex-builder";
import { makeFullCode, type Project } from "~/schema/Project";

const validCodeCharacters = choiceOf(alphanumeric, "&");

/**
 * We have particular requirements for looking up projects by code, so we can't just use an index.
 * - You can look up a project by its full code, e.g. `Feature: API` or `Out`
 * - You can look up a project by its subcode, e.g. `Training` or `Project X` as long as there is only one project with that subcode
 */
const findByCode = (input: string, projects: Project[]) => {
  if (input.length === 0) return E.fail(new ProjectCodeNotFoundError({ input }));

  return E.gen(function* () {
    const [code, subCode] = input.split(/:\s*/gi).map((s) => s.trim().replaceAll(/\s+/g, "-"));

    // see if the code matches a unique fullCode, e.g. `Feature: API` or `Out`
    const fullCode = makeFullCode(code, subCode);
    const fullCodeMatches = projects.find((d) => d.fullCode == fullCode);
    if (fullCodeMatches) return fullCodeMatches;

    if (!subCode) {
      // see if the code matches a unique subcode, e.g. `Training` or `Project X`
      const subCodeMatches = projects.filter((d) => d.subCode == subCode);

      if (subCodeMatches.length === 0) {
        return yield* E.fail(new ProjectCodeNotFoundError({ input }));
      }

      // If there are multiple subCode matches, we can't determine which one the user meant
      if (subCodeMatches.length > 1) {
        const matches = subCodeMatches.map((p) => p.fullCode);
        return yield* E.fail(new AmbiguousProjectCodeError({ input, matches }));
      }

      return subCodeMatches[0];
    }

    return yield* E.fail(new ProjectCodeNotFoundError({ input }));
  });
};

export const parseProject = (input: string) =>
  E.gen(function* () {
    const projects = yield* ProvidedProjects;
    const projectCodeRegex = buildRegExp(
      [
        startWord,
        capture(
          [
            "#",
            capture(
              [
                oneOrMore(validCodeCharacters), // code
                optional([":", zeroOrMore(whitespace), oneOrMore(validCodeCharacters)]), // subCode
              ],
              { name: "code" } // code doesn't include the #
            ),
          ],
          { name: "text" } // text includes the #
        ),
        endWord,
      ],
      { ignoreCase: true, multiline: true, global: true }
    );
    const matches = [...input.matchAll(projectCodeRegex)];
    const results = matches.map((match) => match.groups as { text: string; code: string });

    // Input must contain exactly one project code
    if (results.length > 1) return yield* E.fail(new MultipleProjectsError({ input }));
    if (results.length === 0) return yield* E.fail(new NoProjectError({ input }));

    const { code, text } = results[0];
    const project = yield* findByCode(code, projects);
    if (project === undefined) {
      return yield* E.fail(new ProjectCodeNotFoundError({ input }));
    }
    return { project, text };
  });

class MultipleProjectsError //
  extends Data.TaggedError("parseProject/MultipleProjects")<{ input: string }>
{
  message = `An entry can only have one project code.`;
}

export class NoProjectError //
  extends Data.TaggedError("parseProject/NoProject")<{ input: string }>
{
  message = `You need to include a project code.`;
}

export class ProjectCodeNotFoundError //
  extends Data.TaggedError("ProjectCollection/CodeNotFound")<{ input: string }>
{
  message = `There is no project with code "${this.input}"`;
}

export class AmbiguousProjectCodeError //
  extends Data.TaggedError("ProjectCollection/AmbiguousCodeError")<{
    input: string;
    matches: string[];
  }>
{
  message = `The project code "${this.input}" could match any of these: ${this.matches.join(",")}`;
}
