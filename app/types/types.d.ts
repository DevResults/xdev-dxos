/** LocalState contains any non-shared state data that we want to persist in local storage.  */
export type LocalState = {
  spaceKey?: string;
  invitationCode?: string;
};

export type NavItem = {
  name: string;
  to: string;
  icon: Icon;
};

/** A CollectionItem is an object with an id */
export type CollectionItem = {
  [key: string]: any;
  id: string;
};

/** Matches the name of any string-valued property of T */
export type StringKeyOf<Item extends CollectionItem> = {
  [K in keyof Item]: Item[K] extends string ? K & string : never;
}[keyof Item];
