import { Outlet } from "react-router"
import { SecondaryNav } from "../ui/SecondaryNav"
import { PageLayout } from "../ui/layouts/PageLayout"

export default function SettingsLayout() {
  return (
    <PageLayout
      nav={
        <SecondaryNav
          heading="Settings"
          items={[
            { to: "profile", label: "Profile" },
            { to: "devices", label: "Devices" },
          ]}
          parent="settings"
        />
      }
    >
      <Outlet />
    </PageLayout>
  )
}
