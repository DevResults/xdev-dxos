import { cx } from "~/lib/cx"

/** Container with secondary navigation for everything to the right of the sidebar */
export const PageLayout = ({ nav, children, removePadding = false }: Props) => (
  <>
    <div
      className={cx(
        "shrink-0 border-b px-4",
        "h-12", // Matches height of avatar in Sidebar
        "max-lg:pl-16", // Matches width of open sidebar button + 4
      )}
    >
      {nav}
    </div>
    <div className={cx("grow overflow-auto", !removePadding && "p-4")}>{children}</div>
  </>
)

type Props = {
  nav: React.ReactNode
  children: React.ReactNode
  removePadding?: boolean
}
