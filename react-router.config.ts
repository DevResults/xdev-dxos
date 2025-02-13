import type { Config } from "@react-router/dev/config"

export default {
  // Config options...
  // SPA mode to get our redirects working (also because we eventually want a SPA)
  ssr: false,
} satisfies Config
