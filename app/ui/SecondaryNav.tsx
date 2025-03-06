import { NavLink } from "react-router"
import { useRedirect } from "~/hooks/useRedirect"
import { cx } from "~/lib/cx"

export function SecondaryNav({ heading, items = [], parent: parentPath }: Props) {
  const [firstItem] = items
  useRedirect({ from: `/${parentPath}`, to: `/${parentPath}/${firstItem.to}` })

  return (
    <nav className="flex h-12 w-full shrink-0 flex-row items-stretch gap-2">
      <div className="mr-4 flex items-center border-b-4 border-transparent font-semibold">
        {heading}
      </div>
      {items.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cx([
              "flex items-center whitespace-nowrap border-b-4 px-2 text-sm tracking-wide",
              {
                "border-primary-500 text-black": isActive,
                "border-transparent font-light text-gray-500 hover:border-gray-300": !isActive,
              },
            ])
          }
        >
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

type Props = {
  heading: React.ReactNode
  items?: Array<{ to: string; label: string }>
  parent: string
}
