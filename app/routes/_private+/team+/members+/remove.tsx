import { useTeam } from "~/hooks/useTeam";
import { useLocation, useNavigate } from "react-router";
import { RemoveMemberDialog } from "./ui/RemoveMemberDialog";

export default function RemovePage() {
  const { userId } = useLocation().state;

  const { self } = useTeam();
  const navigate = useNavigate();

  // ----- ↑ hooks

  // Only admins can remove members

  const contact = { userId };

  return (
    <RemoveMemberDialog
      defaultOpen={true}
      onClose={() => navigate("..")}
      contact={contact}
      remove={() => {
        // remove
      }}
    />
  );
}
