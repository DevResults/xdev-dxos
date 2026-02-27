import { useHotkeys } from "react-hotkeys-hook"
import { useNavigate } from "react-router"

export function useNavigationHotkey(keys: string, path: string) {
  const navigate = useNavigate()
  useHotkeys(keys, e => {
    e.preventDefault()
    void navigate(path, { relative: "path" })
  })
}
