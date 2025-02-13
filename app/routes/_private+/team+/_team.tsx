import { Outlet } from "react-router"
import { SecondaryNav } from "../ui/SecondaryNav"
import { PageLayout } from "../ui/layouts/PageLayout"

export default function TeamLayout() {
  return (
    <PageLayout
      nav={
        <SecondaryNav
          heading="Team"
          items={[
            { to: `members`, label: "Members" },
            { to: `clients`, label: "Clients" },
            { to: `projects`, label: "Projects" },
          ]}
          parent="team"
        />
      }
    >
      <Outlet />
    </PageLayout>
  )
}
