import { Button } from "@ui/button"
import { cx } from "lib/cx"
import { useState } from "react"

export const CopyCode = ({ label = "Copy", labelAfter = "Copied", code }: Props) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div
      title={label}
      className={cx(
        "flex cursor-pointer flex-row overflow-hidden rounded-md",
        "has-[:focus]:ring-2 has-[:focus]:ring-neutral-100 has-[:focus]:ring-offset-0",
      )}
      onClick={handleCopy}
    >
      <pre
        className={cx(
          "min-w-0 flex-grow",
          "rounded-md rounded-r-none border border-r-0 border-neutral-300 bg-neutral-100",
          "p-2 text-xs text-black",
        )}
      >
        <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{code}</span>
      </pre>
      <Button
        type="button"
        intent={copied ? "primary" : "neutral"}
        className="rounded-l-none focus:outline-none focus:ring-0 focus:ring-offset-0"
      >
        {copied ?
          <>
            <IconClipboardCheck className="size-5" />
            {labelAfter}
          </>
        : <>
            <IconClipboard className="size-5" />
            {label}
          </>
        }
      </Button>
    </div>
  )
}

type Props = {
  label?: string
  labelAfter?: string
  code: string
}
