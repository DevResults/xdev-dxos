/** Returns a new array in the same order with only the unique values */
export const unique = <T>(array: T[]) => [...new Set(array)]
