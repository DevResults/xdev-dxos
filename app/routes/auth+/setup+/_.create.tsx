import { useNavigate } from "react-router";
import { TeamNameForm } from "./ui/TeamNameForm";
import { useIdentity } from "@dxos/react-client/halo";
import { useClient } from "@dxos/react-client";
import { useLocalState } from "~/hooks/useLocalState";
import { useEffect } from "react";

export default function AuthCreatePage() {
  const identity = useIdentity();
  const navigate = useNavigate();
  const client = useClient();
  const { spaceKey, update } = useLocalState();

  // hooks ↑

  if (!identity?.profile?.displayName) {
    useEffect(() => {
      navigate("/auth/begin");
    }, [identity]);
    return null;
  }

  // already have a team
  if (spaceKey) {
    useEffect(() => {
      navigate("/");
    }, [client]);
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
