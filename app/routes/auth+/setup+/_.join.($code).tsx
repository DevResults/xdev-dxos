import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { InvitationForm } from "./ui/InvitationForm";
import { useShell } from "@dxos/react-client";
import { useLocalState } from "~/hooks/useLocalState";
import { useRedirect } from "~/hooks/useRedirect";
import { useIdentity } from "@dxos/react-client/halo";

export default function AuthJoinPage() {
  const identity = useIdentity();
  const navigate = useNavigate();
  const { spaceKey, invitationCode: savedInvitationCode, update } = useLocalState();
  const invitationCodeFromUrl = useParams().code;
  const [error, setError] = useState<string | undefined>(undefined);
  const shell = useShell();

  const invitationCode = invitationCodeFromUrl ?? savedInvitationCode;

  // hooks ↑

  useRedirect({ from: /.*/, to: "/auth/begin", condition: !identity, localState: { invitationCode } });
  useRedirect({ from: /.*/, to: "/", condition: Boolean(spaceKey) });

  const joinWithCode = async (invitationCode: string) => {
    const { space } = await shell.joinSpace({ invitationCode });
    if (space) {
      // Save our user info etc. to local storage
      update({ spaceKey: space.id, invitationCode: "" });
      navigate(`/`);
    } else {
      setError("Something went wrong... I don't know what");
    }
  };

  return invitationCode ? (
    // Take invitation code from URL & confirm
    <InvitationForm
      heading="Join a team"
      error={error}
      invitationCode={invitationCode}
      readOnly={true}
      onSubmit={async () => joinWithCode(invitationCode)}
    /> // Show input for entering invitation code
  ) : (
    <InvitationForm
      heading="Join a team"
      error={error}
      onSubmit={async ({ invitationCode: enteredInvitationCode }) => joinWithCode(enteredInvitationCode)}
    />
  );
}
