import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { InvitationForm } from "./ui/InvitationForm";

export default function AuthJoinPage() {
  const navigate = useNavigate();
  const invitationCodeFromUrl = useParams().code;
  const [error, setError] = useState<string | undefined>(undefined);

  // hooks ↑

  const joinWithCode = async (invitationCode: string) => {
    // Save our user info etc. to local storage

    navigate("/");
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
