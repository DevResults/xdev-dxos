import type { Preview } from "@storybook/react"
import "../app/index.css"
import "@fontsource/ibm-plex-mono/latin-400.css"
import "@fontsource/ibm-plex-sans/latin-300.css"
import "@fontsource/ibm-plex-sans/latin-400.css"
import "@fontsource/ibm-plex-sans/latin-500.css"
import "@fontsource/ibm-plex-sans/latin-600.css"
import "@fontsource/ibm-plex-sans/latin-700.css"
import "@fontsource/ibm-plex-serif/latin-400.css"
import "@fontsource/ibm-plex-serif/latin-600.css"
import "@fontsource/ibm-plex-serif/latin-700.css"
import { withRouter } from "storybook-addon-remix-react-router"

const preview: Preview = {
  decorators: [withRouter],
  parameters: {
    controls: {
      exclude: ["children", "className", "asChild", "onSubmit"],
    },
    options: {
      storySort: {
        order: [
          "Layouts",
          "Components",
          "Auth", //
          ["UserNameForm", "SetupOptions", "InvitationForm", "TeamNameForm", "Signout"],
          "MyWeek",
          "Dones",
          "Hours",
          "Settings",
        ],
      },
    },
  },
}

export default preview
