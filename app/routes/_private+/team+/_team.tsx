import { Outlet } from "react-router"
import { PageLayout } from "ui/layouts/PageLayout"
import { SecondaryNav } from "ui/SecondaryNav"

export default function TeamLayout() {
  return (
    <PageLayout
      nav={
        <SecondaryNav
          heading="Team"
          items={[
            { to: "members", label: "Members" },
            { to: "clients", label: "Clients" },
            { to: "projects", label: "Projects" },
          ]}
          parent="team"
        />
      }
    >
      <Outlet />
    </PageLayout>
  )
}
