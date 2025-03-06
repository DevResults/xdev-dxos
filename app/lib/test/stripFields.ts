/**
 * Remove specified fields from the object and recursively from any sub-objects,
 * so that you can do snapshot testing without worrying about fields that will
 * be different every time.
 */
export const stripFields =
  (fields: string[]) =>
  (obj: unknown): unknown => {
    // array - strip each element
    if (Array.isArray(obj)) return obj.map(stripFields(fields))

    // object - remove targeted fields, and then strip each remaining value
    if (obj && typeof obj === "object") {
      const stripped = { ...obj } as Record<string, unknown>
      for (const field of fields) {
        if (field in stripped) delete stripped[field]
      }

      return Object.fromEntries(
        Object.entries(stripped).map(([k, v]) => [k, stripFields(fields)(v)]),
      )
    }

    // primitive - return as is
    return obj
  }
