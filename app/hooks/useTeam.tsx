import { DeviceKind, useDevices, useIdentity } from "@dxos/react-client/halo";
import { useLocalState } from "./useLocalState";
import { useMembers, useSpace } from "@dxos/react-client/echo";

/**
 * Takes our auth state and builds a bunch of useful derived state about the user and team.
 */
export const useTeam = () => {
  const identity = useIdentity();
  const { spaceKey } = useLocalState();
  const space = useSpace(spaceKey);
  const members = useMembers(space?.key);
  const devices = useDevices();
  const device = devices.find((d) => d.kind === DeviceKind.CURRENT);

  return {
    self: identity,
    device,
    devices,
    contacts: members.map(({ identity }) => identity),
  };
};
