import { type LocalDate } from "@js-joda/core";
import { formatDate } from "./formatDate";

export const formatDateRange = (
  start: LocalDate,
  end: LocalDate,
  { includeYear = true, monthFormat = "long" }: Options = {}
) => {
  const monthPattern = monthFormat === "short" ? "MMM" : "MMMM";
  const m1 = formatDate(start, monthPattern);
  const m2 = formatDate(end, monthPattern);
  const d1 = formatDate(start, "d");
  const d2 = formatDate(end, "d");
  const y1 = formatDate(start, "yyyy");
  const y2 = formatDate(end, "yyyy");

  // straddling two years: December 31, 2023 – January 6, 2024
  if (y1 !== y2) return `${m1} ${d1}, ${y1} – ${m2} ${d2}, ${y2}`;

  // straddling two months: January 29 – February 4, 2023
  if (m1 !== m2) return `${m1} ${d1} – ${m2} ${d2}${includeYear ? `, ${y2}` : ""}`;

  // same month: January 1 – 7, 2023
  return `${m1} ${d1} – ${d2}${includeYear ? `, ${y2}` : ""}`;
};

export type Options = {
  includeYear?: boolean;
  monthFormat?: "short" | "long";
};
