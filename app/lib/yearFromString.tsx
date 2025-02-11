import { isNumeric } from "./isNumeric";

export const yearFromString = (s: string | undefined) => {
  if (s === undefined) return undefined;
  if (!isNumeric(s)) return undefined;
  return Number.parseInt(s, 10);
};
