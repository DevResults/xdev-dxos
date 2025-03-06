/** Returns a random element from the given array */
export function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}
