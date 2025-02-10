import { ConfirmDialog } from "./ConfirmDialog";

export function RevokeInvitationDialog({
  onClose = () => {},
  contact,
  invitation,
  revoke = () => {},
  defaultOpen = false,
}: Props) {
  if (!invitation) return null;

  return (
    <ConfirmDialog
      title={`Revoke ${contact.firstName}’s invitation?`}
      body={`${contact.firstName} will no longer be able to use it to join.`}
      intent="danger"
      onConfirm={() => {
        revoke();
        onClose();
      }}
      onCancel={onClose}
      confirmButtonText="Yes, revoke"
      defaultOpen={defaultOpen}
    ></ConfirmDialog>
  );
}

export type Props = {
  onClose: () => void;
  contact: any;
  invitation: any;
  revoke: () => void;
  defaultOpen?: boolean;
};
