import { LocalDate } from "@js-joda/core";
import { useParams } from "react-router";
import { getWeek } from "~/lib/getWeek";

export function useSelectedWeek() {
  const { date: dateString } = useParams();
  const today = LocalDate.now();
  const date = dateString ? LocalDate.parse(dateString) : today;
  const week = getWeek(date);
  return week;
}
