import { useIdentity } from "@dxos/react-client/halo";
import { useLocalState } from "./useLocalState";
import { useMembers, useSpace } from "@dxos/react-client/echo";

/**
 * Takes our auth state and builds a bunch of useful derived state about the user and team.
 */
export const useTeam = () => {
  const identity = { identityKey: "uh oh", profile: { displayName: "help" } }; //useIdentity();
  const { spaceKey } = useLocalState();
  const space = useSpace(spaceKey);
  const members = useMembers(space?.key);

  return {
    self: identity,
    contacts: members.map(({ identity }) => identity),
  };
};
