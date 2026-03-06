import { useState } from "react"
import { HexColorPicker, HexColorInput } from "react-colorful"
import { cx } from "~/lib/cx"
import { Popover, PopoverContent, PopoverTrigger } from "~/ui/shadcn/popover"

/** A color swatch that opens a popover with a color picker and hex input. */
export const EditableColorCell = ({ value, onSave }: Props) => {
  const [color, setColor] = useState(value || "#888888")
  const [open, setOpen] = useState(false)

  const handleChange = (newColor: string) => {
    setColor(newColor)
  }

  const handleClose = (isOpen: boolean) => {
    if (!isOpen && color !== value) {
      onSave(color)
    }
    setOpen(isOpen)
  }

  return (
    <Popover open={open} onOpenChange={handleClose}>
      <PopoverTrigger asChild>
        <button
          className={cx(
            "h-6 w-6 cursor-pointer rounded border border-neutral-300",
            "hover:ring-2 hover:ring-primary-300",
            "focus:outline-none focus:ring-2 focus:ring-primary-300",
          )}
          style={{ backgroundColor: color }}
          aria-label="Pick color"
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-auto rounded-lg border border-neutral-200 bg-white p-3 shadow-lg"
        align="start"
      >
        <div className="flex flex-col gap-2">
          <HexColorPicker color={color} onChange={handleChange} />
          <HexColorInput
            color={color}
            onChange={handleChange}
            prefixed
            className={cx(
              "w-full rounded border border-neutral-200 px-2 py-1 text-sm",
              "focus:border-primary-300 focus:outline-none focus:ring-1 focus:ring-primary-300",
            )}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

type Props = {
  /** The current hex color value. */
  value: string
  /** Called with the new hex color on popover close. */
  onSave: (value: string) => void
}
