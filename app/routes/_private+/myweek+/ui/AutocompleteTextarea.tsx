import { Popover, PopoverAnchor, PopoverContent } from "~/ui/shadcn/popover"
import { NO_OP } from "~/lib/constants"
import { cx } from "~/lib/cx"
import { forwardRef, useEffect, useRef, useState, type ForwardedRef } from "react"
import { Caret } from "textarea-caret-ts"
import {
  AutocompleteMenu,
  findAutocompleteQuery,
  getAutocompleteItems,
  type AutocompleteMode,
  type AutocompleteState,
} from "./AutocompleteMenu"

export const AutocompleteTextarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      id,
      value,
      modes,
      className,
      onChange = NO_OP,
      onBlur = NO_OP,
      onFocus = NO_OP,
      onOpen = NO_OP,
      onClose = NO_OP,
      ...props
    }: Props,
    forwardedRef: ForwardedRef<HTMLTextAreaElement>,
  ) => {
    const [isFocused, setIsFocused] = useState(false)

    // Create local ref to ensure we always have a ref object
    const localRef = useRef<HTMLTextAreaElement>(null)
    // Use forwarded ref if provided, otherwise fall back to local ref
    const ref = (forwardedRef ?? localRef) as React.RefObject<HTMLTextAreaElement>

    const autocompleteMenuId = `${id}-autocomplete-menu`

    // if the user is currently typing an autocomplete query, this will contain
    // the query and information about what to do with it
    const [queryState, setQueryState] = useState<AutocompleteState | undefined>()
    const autocompleteItems = queryState ? getAutocompleteItems(queryState, modes) : []
    const [autocompletePosition, setAutocompletePosition] = useState({ x: 0, y: 0 })

    // If the first or only autocomplete item is the current query, we've either typed out a valid
    // item by hand, or we just selected it. In either case, we should not show the autocomplete.
    const justAutocompleted =
      queryState !== undefined &&
      autocompleteItems[0].toLowerCase() === queryState.query.toLowerCase()

    // show the autocomplete if the user is typing a query and there are items to show
    const showAutocomplete =
      queryState !== undefined && //
      isFocused &&
      !justAutocompleted

    useEffect(() => {
      if (showAutocomplete) onOpen()
      else onClose()
    }, [showAutocomplete])

    return (
      <Popover open={showAutocomplete}>
        <PopoverAnchor asChild>
          <textarea
            ref={ref}
            value={value}
            onFocus={e => {
              setIsFocused(true)
              if (onFocus) onFocus(e)
            }}
            onBlur={e => {
              setIsFocused(false)

              // Interaction with the autocomplete causes the textarea to lose focus. We only want
              // to blur if the user is actually leaving the textarea
              if (onBlur && !showAutocomplete) onBlur(e)
            }}
            onChange={e => onChange(e.target.value)}
            onInput={e => {
              const textarea = e.target as HTMLTextAreaElement
              const { value, selectionStart } = textarea
              const query = findAutocompleteQuery(value, selectionStart, modes)
              setQueryState(query)
              if (query) {
                const { top, left, height } = Caret.getRelativePosition(textarea)
                const textareaRect = textarea.getBoundingClientRect()
                const x = left - textareaRect.width / 2
                const y = top - textareaRect.height + height
                setAutocompletePosition({ x, y })
              }
            }}
            role="combobox"
            aria-expanded={showAutocomplete}
            aria-controls={autocompleteMenuId}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            className={cx("", className)}
            {...props}
          />
        </PopoverAnchor>
        <PopoverContent
          asChild
          side={"bottom"}
          onOpenAutoFocus={e => e.preventDefault()} // don't steal focus
        >
          {showAutocomplete ?
            <>
              <div
                className="max-h-64 w-64 overflow-auto border bg-white text-xs shadow-md outline-none"
                style={{
                  position: "absolute",
                  zIndex: 1000,
                  left: autocompletePosition.x,
                  top: autocompletePosition.y,
                }}
              >
                {autocompleteItems.length > 0 ?
                  <AutocompleteMenu
                    id={autocompleteMenuId}
                    items={autocompleteItems}
                    onSelect={async selectedValue => {
                      const { start, end, trigger } = queryState

                      // Insert selected text
                      const before = value.slice(0, start)
                      const after = value.slice(end)
                      onChange(`${before}${trigger}${selectedValue} ${after}`)

                      // Position cursor just after selected text
                      await nextFrame()
                      const textarea = ref.current
                      if (textarea) {
                        const newPosition = start + trigger.length + selectedValue.length + 1
                        textarea.setSelectionRange(newPosition, newPosition)
                        textarea.focus()
                      }

                      setQueryState(undefined)
                    }}
                  />
                : <div className="p-2">
                    No {queryState.type.toLowerCase()}s found matching{" "}
                    <b>
                      {queryState.trigger}
                      {queryState.query}
                    </b>
                  </div>
                }
              </div>
            </>
          : null}
        </PopoverContent>
      </Popover>
    )
  },
)
AutocompleteTextarea.displayName = "AutocompleteTextarea"

export type Props = {
  value: string
  modes: AutocompleteMode[]
  onChange?: (value: string) => void
  onOpen?: () => void
  onClose?: () => void
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange">

// HELPERS

const nextFrame = async () =>
  new Promise(resolve => {
    requestAnimationFrame(resolve)
  })
