import { cx } from "~/lib/cx"

/** A scrollable content pane within a PageLayout. Handles padding, overflow, and flex sizing. */
export const Pane = ({ children, className }: Props) => (
  <div className={cx("min-w-0 overflow-auto p-4", className)}>{children}</div>
)

type Props = {
  children: React.ReactNode
  className?: string
}
