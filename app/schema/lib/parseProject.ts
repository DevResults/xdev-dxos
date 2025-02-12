import { Data, E } from "./Effect";
import { alphanumeric, endWord, startWord } from "./regex";
import { ProvidedProjects } from "../ProjectCollection";
import { buildRegExp, capture, choiceOf, oneOrMore, optional, whitespace, zeroOrMore } from "ts-regex-builder";

const validCodeCharacters = choiceOf(alphanumeric, "&");

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
    const project = projects.find((d) => d == code);
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
