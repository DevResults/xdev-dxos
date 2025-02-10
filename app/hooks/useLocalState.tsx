import { useLocalStorage } from "@uidotdev/usehooks";
import type { LocalState } from "~/types/types.d.ts";

export function useLocalState() {
  const initialState: LocalState = {};
  const [state, setState] = useLocalStorage("xdev-localstate", initialState);

  const { spaceKey } = state;

  return {
    spaceKey,

    update: (s: Partial<LocalState>) => setState({ ...state, ...s }),
    reset: () => setState(initialState),
  };
}
