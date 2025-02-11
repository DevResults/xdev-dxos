import { useNavigate } from "react-router";
import { useTeam } from "~/hooks/useTeam";
import { InviteDeviceDialog } from "./ui/InviteDeviceDialog";

export default function DevicesInvitePage() {
  const { self } = useTeam();
  const navigate = useNavigate();

  const invitationCode = "invite me";

  return (
    <InviteDeviceDialog
      defaultOpen={true}
      onClose={() => navigate("..")}
      invitationCode={invitationCode}
    />
  );
}
