import { Outlet } from "react-router";
import { CenteredLayout } from "~/ui/layouts/CenteredLayout";

export default function AuthLayout() {
  return (
    <CenteredLayout>
      <Outlet />
    </CenteredLayout>
  );
}
