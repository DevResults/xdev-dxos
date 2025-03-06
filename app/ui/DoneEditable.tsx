import { Likes } from "./Likes"
import { DeleteButton } from "./DeleteButton"
import { DoneInput, type Props as InputProps } from "./DoneInput"
import type { DoneEntry } from "~/schema/DoneEntry"
import { cx } from "~/lib/cx"
import type { Contact } from "~/schema/Contact"

/**
 * Used for displaying the current user's own dones to them so they can edit them. Wraps a
 * DoneInput and adds the like button and delete button.
 */
export const DoneEditable = ({
  done,
  onDestroy,
  onUpdate,
  self,
  contacts,
  ...passthruProps
}: Props) => {
  if (done === undefined) return null
  const { content, likes = [] } = done

  return (
    <span
      className={cx(
        "group relative block rounded-md border-2 border-transparent bg-neutral-50 p-2",
        "focus-within:border-primary-600 focus-within:bg-white",
      )}
    >
      <DoneInput content={content} {...passthruProps} onDestroy={onDestroy} onChange={onUpdate} />
      <Likes
        likes={likes.map(id => contacts.find(d => d.id === id)).filter(d => d !== undefined)}
        self={self}
      />
      <span className="absolute right-0 top-0">
        <DeleteButton onDestroy={onDestroy} />
      </span>
    </span>
  )
}

type PassthruProps = Pick<InputProps, "isFocused" | "onFocus" | "onFocusNext" | "onFocusPrev">

export type Props = {
  done: DoneEntry
  index: number
  onDestroy: () => void
  onUpdate: (content: string) => void
  self: Contact
  contacts: Contact[]
} & PassthruProps
