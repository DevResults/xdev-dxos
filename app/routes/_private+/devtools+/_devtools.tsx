import { Outlet } from "react-router"
import { PageLayout } from "../ui/layouts/PageLayout"
import { SecondaryNav } from "../ui/SecondaryNav"

export default function DevtoolsPage() {
  return (
    <PageLayout
      nav={
        <SecondaryNav
          heading="Dev tools"
          items={[
            { to: "inspector", label: "Inspector" },
            { to: "danger", label: "Danger zone" },
          ]}
          parent="devtools"
        />
      }
    >
      <Outlet />
    </PageLayout>
  )
}
