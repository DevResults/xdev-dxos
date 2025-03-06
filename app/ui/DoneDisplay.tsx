import { cx } from "lib/cx"
import type { DoneEntry } from "schema/DoneEntry"
import type { Contact } from "schema/Contact"
import { Likes } from "ui/Likes"

/**
 * Displays a read-only DoneEntry along with the Like button.
 */
export function DoneDisplay({ className = "", done, self, contacts }: Props) {
  const { content, likes } = done
  return (
    <li className="rounded-md bg-neutral-50 p-2">
      <span className={cx("done-entry whitespace-pre-line", className)}>{content}</span>
      <Likes
        likes={likes.map(id => contacts.find(d => d.id === id)).filter(d => d !== undefined)}
        self={self}
        onToggle={() => {
          const newLikes = new Set(likes ?? [])
          if (!newLikes.delete(self.id)) newLikes.add(self.id)
          done.likes = [...newLikes]
        }}
      />
    </li>
  )
}

type Props = {
  className?: string
  done: DoneEntry
  self: Contact
  contacts: Contact[]
}
