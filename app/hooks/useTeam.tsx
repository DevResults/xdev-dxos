import { DeviceKind, useDevices, useIdentity } from "@dxos/react-client/halo";
import { useLocalState } from "./useLocalState";
import { create, Filter, useQuery, useSpace } from "@dxos/react-client/echo";
import { Contact } from "~/schema/Contact";

/**
 * Takes our auth state and builds a bunch of useful derived state about the user and team.
 */
export const useTeam = () => {
  const identity = useIdentity();
  const { spaceKey } = useLocalState();
  const space = useSpace(spaceKey);
  const contacts = useQuery(space, Filter.schema(Contact));
  const devices = useDevices();
  const device = devices.find((d) => d.kind === DeviceKind.CURRENT);
  const self = contacts.find((d) => d.identityId == identity?.identityKey.toString()) as Contact;

  return {
    self,
    device,
    devices,
    contacts,
  };
};
