import { useIdentity } from "@dxos/react-client/halo";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export default function Private() {
  const identity = useIdentity();
  const navigate = useNavigate();
  useEffect(() => {
    if (!identity?.profile) navigate("/auth/begin");
  }, [identity]);
  return <Outlet></Outlet>;
}
