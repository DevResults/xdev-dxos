import { NavLink } from "react-router"
import { Avatar } from "./Avatar"
import { cx } from "~/lib/cx"
import type { Contact } from "~/schema/Contact"
import type { NavItem } from "~/types/types"

export function Sidebar({ self, close }: Props) {
  const navigation: NavItem[] = [
    { name: "My week", to: "/myweek", icon: IconCalendarWeekFilled },
    { name: "Hours", to: "/hours", icon: IconClock2 },
    { name: "Dones", to: "/dones", icon: IconClipboardCheck },
  ]

  const userNavigation: NavItem[] = [
    { name: "Settings", to: "/settings", icon: IconAdjustments },
    { name: "Team", to: "/team", icon: IconUsersGroup },
    { name: "Dev tools", to: "/devtools", icon: IconTools },
    { name: "Sign out", to: "/auth/signout", icon: IconLogout2 },
  ]

  return (
    <aside className="flex h-full flex-col gap-2 overflow-y-auto bg-neutral-50 pb-2">
      {/* avatar & name */}
      <header
        className={cx(
          "flex flex-row items-center border-b px-2",
          "h-12", // Matches height of nav in PageLayout
        )}
      >
        <span className="w-11">
          <Avatar size="sm" contact={self} className="mx-auto" />
        </span>
        <span className="truncate text-sm font-semibold text-black">{self.firstName}</span>
      </header>

      {/* app navigation */}
      <div className="grow">
        <NavLinks items={navigation} close={close} />
      </div>

      {/* user navigation (bottom of sidebar) */}
      <NavLinks items={userNavigation} close={close} />
    </aside>
  )
}

const NavLinks = ({ items, close }: { items: NavItem[]; close: undefined | (() => void) }) => (
  <nav>
    <ul role="list" className="flex-col gap-y-2">
      {items.map(item => (
        <li key={item.to} className="py-2">
          <NavLink
            onClick={close}
            to={item.to}
            className={({ isActive }) =>
              cx("flex items-center border-l-4 px-2 text-sm leading-6", {
                "border-l-primary-500 bg-neutral-50 font-bold text-black": isActive,
                "border-l-transparent text-neutral-500 hover:border-l-neutral-500": !isActive,
              })
            }
          >
            <div className="w-10">
              <item.icon className="mx-auto h-5 w-5" aria-hidden="true" />
            </div>
            <div>{item.name}</div>
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
)

type Props = {
  self: Contact

  close?: undefined | (() => void)
}
