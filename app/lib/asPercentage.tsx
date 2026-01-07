export const asPercentage = (number_: number, total: number) =>
  `${Math.round((number_ / total) * 100)}%`
