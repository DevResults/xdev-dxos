import type { LocalDate } from "@js-joda/core"
import { Popover, PopoverAnchor, PopoverArrow, PopoverContent } from "@ui/popover"
import { useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { AutocompleteTextarea } from "./AutocompleteTextarea"
import { NO_OP } from "~/lib/constants"
import { cx } from "~/lib/cx"
import { Keys } from "~/lib/keys"
import type { Client } from "~/schema/Client"
import type { Contact } from "~/schema/Contact"
import type { Project } from "~/schema/Project"
import { parseTimeEntries, type TimeEntry } from "~/schema/TimeEntry"

const { enter, escape, up, down, left, right } = Keys

/**
 * Used to create a new time entry or edit an existing one. Used by DailyTimeEntries (for creating new entries)
 * and TimeEntryEditable (for editing existing ones).
 */
export const TimeEntryInput = ({
  content,
  index,
  isFocused = false,
  self,
  date,
  projects,
  clients,
  onFocus = NO_OP,
  onFocusNext = NO_OP,
  onFocusPrev: onFocusPrevious = NO_OP,
  onDestroy = NO_OP,
  onCommit = NO_OP,
  onDiscard = NO_OP,
}: Props) => {
  // The content of the entry while editing
  const [newContent, setNewContent] = useState(content)

  // Errors detected in the input
  const [errors, setErrors] = useState<Error[]>([])
  const showError = errors.length > 0
  const errorMessageId = `time-entry-error-${date.toString()}`

  // Bind textarea to hotkeys
  const textareaRef = useHotkeys<HTMLTextAreaElement>(
    [enter, escape, up, down, left, right],
    (e, { keys = [] }) => {
      const textarea = textareaRef.current
      if (!textarea) {
        return
      }

      const { value, textContent, selectionStart } = textarea

      const key = keys.join("")
      if (key === escape) {
        setNewContent(content) // Restore the original content
        setErrors([])
        onDiscard()
        // Yield a tick to let the content be restored, and then blur
        setTimeout(() => {
          textarea.blur()
        }, 1)
      } else if (key === enter) {
        e.preventDefault()
        commit(textContent ?? "")
      } else if (!autocompleteOpen) {
        // Only handle arrow keys if we're not in an autocomplete query
        if (key === up && selectionStart === 0) {
          onFocusPrevious()
        } else if (key === down && selectionStart === value.length) {
          onFocusNext()
        }
      }
    },
    { enableOnFormTags: true },
  )

  useEffect(() => {
    // Select the content when entering focus
    if (isFocused) {
      textareaRef.current?.select()
    }
  }, [isFocused, textareaRef])

  useEffect(() => {
    // Update the input when the content of the time entry is modified from elsewhere
    setNewContent(content)
  }, [content])

  const [autocompleteOpen, setAutocompleteOpen] = useState(false)

  /**
   * Given a (potentially multiline) input string, attempts to parse into one or more time entries.
   * Records any errors, and if there are none commits the entries. If the input is empty, the entry
   * is destroyed.
   */
  const commit = (content: string) => {
    content = content.trim()

    // Empty content means the entry should be removed
    if (content.length === 0) {
      onDestroy()
    } else {
      // Process each line as a separate entry
      const [errors, parsedEntries] = parseTimeEntries({
        input: content,
        contactId: self.id,
        date: date.toString(),
        projects,
        clients,
      })

      // Errors will be displayed in the popover
      setErrors(errors)

      // Only commit if there are no errors
      if (errors.length === 0) {
        for (const entry of parsedEntries) {
          onCommit(entry)
          onFocusNext()
        }
      }
    }
  }

  return (
    <Popover open={showError}>
      <PopoverAnchor asChild>
        {/* INPUT TEXTAREA */}
        <AutocompleteTextarea
          ref={textareaRef}
          className={cx(
            "block h-full w-full resize-none overflow-hidden break-words rounded-md border p-2 outline-none",
            "text-xs font-normal leading-tight",
            "focus:border-2 focus:border-primary-600",
            showError && "border-danger",
          )}
          value={newContent}
          modes={
            [
              {
                type: "PROJECT",
                trigger: "#",
                collection: projects,
                property: "fullCode",
              },
              {
                type: "CLIENT",
                trigger: "@",
                collection: clients,
                property: "code",
              },
            ] as const
          }
          aria-invalid={showError}
          aria-errormessage={errorMessageId}
          onFocus={() => {
            onFocus(index)
          }}
          onBlur={e => {
            commit(e.target.value)
          }}
          onChange={(value: string) => {
            setErrors([]) // Don't keep errors around if the user starts typing again
            setNewContent(value)
          }}
          onOpen={() => {
            setAutocompleteOpen(true)
          }}
          onClose={() => {
            setAutocompleteOpen(false)
          }}
        />
      </PopoverAnchor>
      <PopoverContent
        asChild
        side={showError ? "top" : "bottom"}
        onOpenAutoFocus={e => {
          e.preventDefault()
        }}
      >
        {/* ERRORS */}
        {showError ? (
          <div
            id={errorMessageId}
            className="flex flex-col gap-1 rounded-md bg-danger p-2 shadow-md outline-none"
            style={{ width: "var(--radix-popover-trigger-width)" }}
          >
            <PopoverArrow className="-mt-px h-3 w-4 fill-danger" />
            {errors.map((error, i) => (
              <div key={i} className="flex flex-row gap-1 leading-tight text-white">
                <span className="text-sm">
                  <IconExclamationCircleFilled className="text-white" />
                </span>
                <span className="text-sm">{error.message}</span>
              </div>
            ))}
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

export type Props = {
  content: string
  index: number
  self: Contact
  date: LocalDate
  projects: Project[]
  clients: Client[]
  isFocused?: boolean
  onFocus?: (index: number) => void
  onFocusNext?: () => void
  onFocusPrev?: () => void
  onDestroy?: () => void
  onCommit?: (timeEntry: TimeEntry) => void
  onDiscard?: () => void
}
