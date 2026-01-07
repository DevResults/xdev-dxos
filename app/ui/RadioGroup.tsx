import * as Headless from "@headlessui/react"
import { Label } from "@ui/label"
import { useState } from "react"
import { cx } from "~/lib/cx"

export function RadioGroup<T extends string | number | boolean>({
  label,
  initialValue,
  onChange = () => {},
  options,
}: Props<T>) {
  const [selectedValue, setSelectedValue] = useState(initialValue)
  return (
    <Headless.RadioGroup
      value={selectedValue}
      onChange={(v: string) => {
        setSelectedValue(v)
        onChange(v)
      }}
      className="flex flex-row items-center space-x-2"
    >
      {/* label */}
      <Label className="w-1/5 pr-2" children={label} />

      {/* options */}
      <div className="isolate inline-flex">
        {options.map((o, i) => {
          const option = typeof o === "string" ? { value: o, label: o, title: undefined } : o
          const { value, label = value.toString(), title } = option
          return (
            <Headless.RadioGroup.Option
              key={i}
              value={value}
              className={({ checked }) =>
                cx([
                  "relative inline-flex cursor-pointer items-center border px-3 py-1 text-sm text-neutral-700",
                  // Focused
                  "focus:z-20 focus:border-primary-700 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary-700",
                  // First item
                  { "rounded-r-md": i === options.length - 1 },
                  // Items after the first
                  { "-ml-px": i > 0 },
                  // Last item
                  { "rounded-l-md": i === 0 },
                  // Selected
                  { "z-10 border-primary-500 bg-primary-100 font-medium text-black": checked },
                  // Unselected
                  { "border-neutral-300": !checked },
                  // Unselected (hover)
                  { "hover:bg-neutral-50 hover:text-black": !checked },
                ])
              }
              title={title}
            >
              {label}
            </Headless.RadioGroup.Option>
          )
        })}
      </div>
    </Headless.RadioGroup>
  )
}

type Props<T> = {
  label: React.ReactNode
  initialValue: string
  onChange?: (value: string) => void
  options: Options<T>
}

type Options<T> =
  | Array<{
      value: T
      label?: React.ReactNode
      title?: string
    }>
  | string[]
