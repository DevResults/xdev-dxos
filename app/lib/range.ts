// Signature overloads

/** Returns a range from 1 to `stop` */
export function range(stop: number): number[]
/** Returns a range from `start` to `stop` */
export function range(start: number, stop: number): number[]
/** Returns a range from `start` to `stop` with intervals of `step` */
export function range(props: Props): number[]

export function range(...args: unknown[]): number[] {
  let props
  if (Object.getOwnPropertyNames(args[0]).includes("stop")) {
    props = args[0]
  } // Range({start: 2, stop:5}) = 2..5
  else if (args.length === 2) {
    props = { start: args[0], stop: args[1] } // Range(0,5) = 0..5
  } else if (args.length === 1) {
    props = { stop: args[0] } // Range(5) = 1..5
  }

  if (props === undefined) {
    throw new Error("Incorrect arguments for the range function")
  }

  const { start = 1, stop, step = 1 } = props as Props

  const length = Math.floor((stop - start) / step) + 1
  const arrayFullOfStartValue = Array.from<number>({ length }).fill(start)
  return arrayFullOfStartValue.map((d, i) => d + i * step)
}

export type Props = {
  start?: number
  stop: number
  step?: number
}
