import { Checkbox } from "@ui/checkbox"

/** A checkbox cell that saves immediately on change. */
export const EditableCheckboxCell = ({ value, onSave }: Props) => {
  return (
    <div className="flex items-center justify-center">
      <Checkbox checked={value} onCheckedChange={checked => onSave(checked === true)} />
    </div>
  )
}

type Props = {
  /** The current boolean value. */
  value: boolean
  /** Called with the new value immediately on change. */
  onSave: (value: boolean) => void
}
