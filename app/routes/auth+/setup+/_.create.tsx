import { useNavigate } from "react-router";
import { TeamNameForm } from "./ui/TeamNameForm";
import { useIdentity } from "@dxos/react-client/halo";
import { useClient } from "@dxos/react-client";
import { useLocalState } from "~/hooks/useLocalState";
import { useRedirect } from "~/hooks/useRedirect";

export default function AuthCreatePage() {
  const identity = useIdentity();
  const navigate = useNavigate();
  const client = useClient();
  const { spaceKey, update } = useLocalState();

  // hooks ↑

  useRedirect({ from: "/auth/setup/create", to: "/auth/begin", condition: !identity?.profile?.displayName });

  // already have a team
  useRedirect({ from: "/auth/setup/create", to: "/", condition: Boolean(spaceKey) });

  const defaultTeamName = "DevResults";

  return (
    <TeamNameForm
      teamName={defaultTeamName}
      onSubmit={async ({ teamName }) => {
        // create a space with the team name
        const space = await client.spaces.create({ name: teamName });
        update({ spaceKey: space.key });
        await space.waitUntilReady();

        // Navigate to the app
        navigate("/");
      }}
    />
  );
}
