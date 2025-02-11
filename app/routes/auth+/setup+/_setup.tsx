import { SetupOptions } from "./ui/SetupOptions";
import { useIdentity } from "@dxos/react-client/halo";
import { useRedirect } from "~/hooks/useRedirect";
import { useLocalState } from "~/hooks/useLocalState";

export default function Setup() {
  const identity = useIdentity();
  const { invitationCode, spaceKey } = useLocalState();

  useRedirect({ from: "/auth/setup", to: "/auth/begin", condition: !identity?.profile?.displayName });
  useRedirect({ from: "/auth/setup", to: `/auth/setup/join/${invitationCode}`, condition: Boolean(invitationCode) });
  useRedirect({ from: "/auth/setup", to: "/", condition: Boolean(identity) && Boolean(spaceKey) });

  return <SetupOptions />;
}
