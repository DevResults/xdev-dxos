import { useNavigate } from "react-router";
import { useHotkeys } from "react-hotkeys-hook"

export function useNavigationHotkey(keys: string, path: string) {
  const navigate = useNavigate()
  useHotkeys(keys, e => {
    e.preventDefault()
    navigate(path, { relative: "path" })
  })
}
