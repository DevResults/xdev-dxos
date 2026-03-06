import { useEffect, useRef, useState } from "react"
import { cx } from "~/lib/cx"

/** A click-to-edit text cell. Shows plain text; click to switch to an input. */
export const EditableTextCell = ({ value, onSave }: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  if (!isEditing) {
    return (
      <div
        className={cx("cursor-text rounded px-1 py-0.5 hover:bg-neutral-100", !value && "min-h-6")}
        onClick={() => setIsEditing(true)}
      >
        {value}
      </div>
    )
  }

  return (
    <input
      ref={inputRef}
      className="w-full rounded border border-primary-300 bg-white px-1 py-0.5 outline-none focus:ring-1 focus:ring-primary-300"
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={() => {
        onSave(draft)
        setIsEditing(false)
      }}
      onKeyDown={e => {
        if (e.key === "Enter") {
          e.currentTarget.blur()
        } else if (e.key === "Escape") {
          setDraft(value)
          setIsEditing(false)
        }
      }}
    />
  )
}

type Props = {
  /** The current text value. */
  value: string
  /** Called with the new value on blur or Enter. */
  onSave: (value: string) => void
}
