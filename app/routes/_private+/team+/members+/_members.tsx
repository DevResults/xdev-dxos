import { useTeam } from "~/hooks/useTeam";
import { Outlet } from "react-router";
import { Members } from "./ui/Members";

export default function MembersPage() {
  const { contacts, self } = useTeam();
  return (
    <>
      <Members
        contacts={Object.values(contacts)}
        self={self}
        onPromote={() => {}}
        onDemote={() => {}}
        onRemove={() => {}}
        onInvite={() => {}}
        onRevokeInvitation={() => {}}
      />
      {/* Outlet for dialogs */}
      <Outlet />
    </>
  );
}
