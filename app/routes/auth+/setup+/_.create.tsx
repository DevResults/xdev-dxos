import { useNavigate } from "react-router";
import { TeamNameForm } from "./ui/TeamNameForm";
import { useIdentity } from "@dxos/react-client/halo";
import { useClient } from "@dxos/react-client";

export default function AuthCreatePage() {
  const identity = useIdentity();
  const navigate = useNavigate();
  const client = useClient();

  // hooks ↑

  if (!identity?.profile?.displayName) {
    navigate("/auth/begin");
    return null;
  }

  const defaultTeamName = "DevResults";

  return (
    <TeamNameForm
      teamName={defaultTeamName}
      onSubmit={async ({ teamName }) => {
        // create a space with the team name
        const space = await client.spaces.create({ name: teamName });
        await space.waitUntilReady();

        // Navigate to the app
        navigate("/");
      }}
    />
  );
}
