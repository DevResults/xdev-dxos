export const Keys = {
  enter: "enter",
  tab: "tab",
  down: "down",
  left: "left",
  right: "right",
  up: "up",
  end: "end",
  home: "home",
  pagedown: "pagedown",
  pageup: "pageup",
  backspace: "backspace",
  escape: "escape",
  delete: "delete",
} as const
export type Keys = (typeof Keys)[keyof typeof Keys]
