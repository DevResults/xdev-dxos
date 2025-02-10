import { useIdentity } from "@dxos/react-client/halo";

/**
 * Takes our auth state and builds a bunch of useful derived state about the user and team.
 */
export const useTeam = () => {
  const identity = useIdentity();

  return {
    self: identity,
    contacts: [identity],
  };
};
