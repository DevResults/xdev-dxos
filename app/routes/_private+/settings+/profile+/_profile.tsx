import { Pane } from "ui/layouts/Pane"
import { ComingSoon } from "~/ui/ComingSoon"

/** This is where people can update their personal info, avatar, etc. */
export default function ProfilePage() {
  return (
    <Pane>
      <ComingSoon>
        <IconUserCircle />
      </ComingSoon>
    </Pane>
  )
}
