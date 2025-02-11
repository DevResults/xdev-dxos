import { useParams } from "react-router";
import { getCurrentYear } from "~/lib/getCurrentYear";
import { yearFromString } from "~/lib/yearFromString";

export function useSelectedYear() {
  const { year } = useParams();
  return yearFromString(year) ?? getCurrentYear();
}
