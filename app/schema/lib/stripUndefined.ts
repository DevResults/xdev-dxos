type CollectionItem = {
  [key: string]: any;
  id: string;
};

/** Remove undefined values from an object */
export const stripUndefined = <T extends CollectionItem>(item: T): T =>
  Object.fromEntries(Object.entries(item).filter(([_, value]) => value !== undefined)) as T;
