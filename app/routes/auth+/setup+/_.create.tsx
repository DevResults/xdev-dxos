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

  if (!identity?.profile?.displayName) {
    useRedirect({ from: "/auth/setup/create", to: "/auth/begin" });
    return null;
  }

  // already have a team
  if (spaceKey) {
    useRedirect({ from: "/auth/setup/create", to: "/" });
    return null;
  }

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
