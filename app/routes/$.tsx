import { useRedirect } from "~/hooks/useRedirect"

export default function GlobalRedirects() {
  useRedirect({ from: /^\/join\/(.+)/i, to: "/auth/setup/join/$1" })
  useRedirect({ from: /^\/link\/(.+)/i, to: "/auth/setup/link/$1" })
}
