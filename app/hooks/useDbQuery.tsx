import { Filter, useQuery, useSpace, type Live } from "@dxos/react-client/echo"
import { type Schema } from "effect"
import { useLocalState } from "./useLocalState"

/** Typed query hook that automatically binds to the current space. */
export const useDbQuery = <S extends Schema.Schema.All>(
  /** The schema type to query for (e.g. `TimeEntry`, `Project`). */
  schema: S,
): Live<Schema.Schema.Type<S>>[] => {
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)
  return useQuery(space, Filter.type(schema))
}
