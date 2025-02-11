import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { InvitationForm } from "./ui/InvitationForm";
import { useShell } from "@dxos/react-client";
import { useLocalState } from "~/hooks/useLocalState";
import { useRedirect } from "~/hooks/useRedirect";

export default function AuthJoinPage() {
  const navigate = useNavigate();
  const invitationCodeFromUrl = useParams().code;
  const [error, setError] = useState<string | undefined>(undefined);
  const shell = useShell();
  const { spaceKey, update } = useLocalState();

  // hooks ↑

  if (spaceKey) {
    useRedirect({ from: /.*/, to: "/" });
    return null;
  }

  const joinWithCode = async (invitationCode: string) => {
    const { space } = await shell.joinSpace({ invitationCode });
    if (space) {
      // Save our user info etc. to local storage
      update({ spaceKey: space.id });
      navigate(`/`);
    } else {
      setError("Something went wrong... I don't know what");
    }
  };

  return invitationCodeFromUrl ? (
    // Take invitation code from URL & confirm
    <InvitationForm
      heading="Join a team"
      error={error}
      invitationCode={invitationCodeFromUrl}
      readOnly={true}
      onSubmit={async () => joinWithCode(invitationCodeFromUrl)}
    /> // Show input for entering invitation code
  ) : (
    <InvitationForm
      heading="Join a team"
      error={error}
      onSubmit={async ({ invitationCode }) => joinWithCode(invitationCode)}
    />
  );
}
