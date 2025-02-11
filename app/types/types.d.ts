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
