import type { Preview } from "@storybook/react"
import "../app/index.css"
import "@ibm/plex/css/ibm-plex.css"
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
