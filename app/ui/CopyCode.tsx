import { Button } from "@ui/button"
import { cx } from "lib/cx"
import { useState } from "react"

/** Render a copyable, single-line code pill with an action button. */
export const CopyCode = ({ label = "Copy", labelAfter = "Copied", code }: Props) => {
  const [copied, setCopied] = useState(false)

  /** Copy the current code string and show a short-lived confirmation state. */
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
        "flex w-full min-w-0 max-w-full cursor-pointer flex-row overflow-hidden rounded-md",
        "has-[:focus]:ring-2 has-[:focus]:ring-neutral-100 has-[:focus]:ring-offset-0",
      )}
      onClick={handleCopy}
    >
      <pre
        className={cx(
          "min-w-0 flex-grow overflow-hidden",
          "rounded-md rounded-r-none border border-r-0 border-neutral-300 bg-neutral-100",
          "p-2 text-xs text-black",
        )}
      >
        <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{code}</span>
      </pre>
      <Button
        type="button"
        intent={copied ? "primary" : "neutral"}
        className="shrink-0 rounded-l-none focus:outline-none focus:ring-0 focus:ring-offset-0"
      >
        {copied ? (
          <>
            <IconClipboardCheck className="size-5" />
            {labelAfter}
          </>
        ) : (
          <>
            <IconClipboard className="size-5" />
            {label}
          </>
        )}
      </Button>
    </div>
  )
}

type Props = {
  /** Label shown on the action button before copying. */
  label?: string
  /** Label shown on the action button after copying. */
  labelAfter?: string
  /** The string to display and copy to the clipboard. */
  code: string
}
