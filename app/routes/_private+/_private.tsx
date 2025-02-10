import { useIdentity } from "@dxos/react-client/halo";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { AppLayout } from "~/ui/layouts/AppLayout";
import { Loading } from "~/ui/Loading";

export default function Private() {
  const identity = useIdentity();
  const navigate = useNavigate();
  useEffect(() => {
    if (!identity?.profile) navigate("/auth/begin");
  }, [identity]);
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const identity = useIdentity();
  if (identity === undefined) return <Loading />;

  return <AppLayout self={identity}>{children}</AppLayout>;
}
