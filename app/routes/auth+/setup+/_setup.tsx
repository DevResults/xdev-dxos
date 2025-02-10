import { useNavigate } from "react-router";
import { SetupOptions } from "./ui/SetupOptions";
import { useIdentity } from "@dxos/react-client/halo";

export default function Setup() {
  const identity = useIdentity();
  const navigate = useNavigate();
  if (!identity?.profile?.displayName) navigate("/auth/begin");

  return <SetupOptions />;
}
