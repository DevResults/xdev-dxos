import { Order } from "effect"
import type { NonEmptyArray } from "effect/Array"
import { Array as A, pipe } from "~/schema/lib/Effect"

/** Given a list of scores associated with IDs, returns a map of rank to ids, where 0 is the lowest rank. */
export const rankByScore = (items: Item[]) => {
  const itemsByRank = pipe(
    items as NonEmptyArray<Item>,
    A.sortWith(item => item.score, Order.number),
    A.groupWith((a, b) => a.score === b.score),
  )
  return new Map(itemsByRank.map((group, index) => [index, group.map(item => item.id)]))
}

type Item = { id: string; score: number }
