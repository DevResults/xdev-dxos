/** returns a new array in the same order with only the unique values */
export const unique = <T>(arr: T[]) => [...new Set(arr)]
