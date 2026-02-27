import { withTrackSignals } from "@preact-signals/safe-react/manual"
import { cx } from "lib/cx"
import type { Contact } from "schema/Contact"
import type { DoneEntry } from "schema/DoneEntry"
import { Likes } from "ui/Likes"

// We're using withTrackSignals for reactivity as per [this conversation](https://discord.com/channels/837138313172353095/1340003933757902908/1458261445677678664).
// When DXOS releases`useObject` or similar, we can switch to that.

/**
 * Displays a read-only DoneEntry along with the Like button.
 */
export const DoneDisplay = withTrackSignals(({ className = "", done, self, contacts }: Props) => {
  const { content, likes } = done
  return (
    <li className="rounded-md bg-neutral-50 p-2">
      <span className={cx("done-entry whitespace-pre-line", className)}>{content}</span>
      <Likes
        likes={likes.map(id => contacts.find(d => d.id === id)).filter(d => d !== undefined)}
        self={self}
        onToggle={() => {
          const newLikes = new Set(likes ?? [])
          if (!newLikes.delete(self.id)) {
            newLikes.add(self.id)
          }

          done.likes = [...newLikes]
        }}
      />
    </li>
  )
})

type Props = {
  className?: string
  done: DoneEntry
  self: Contact
  contacts: Contact[]
}
