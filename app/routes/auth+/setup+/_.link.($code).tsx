import { useNavigate } from "react-router";
import { InvitationForm } from "./ui/InvitationForm";

export default function AuthLinkPage() {
  const navigate = useNavigate();

  // hooks ↑

  return (
    <InvitationForm
      heading="Link a device"
      onSubmit={async ({ invitationCode }) => {
        navigate("/");
      }}
    />
  );
}
