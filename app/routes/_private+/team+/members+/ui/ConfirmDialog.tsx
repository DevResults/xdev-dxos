import { Button } from "~/ui/shadcn/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/ui/shadcn/dialog";
import { useEffect, useState } from "react";

export function ConfirmDialog({
  confirmButtonText = "Yes, do it",
  cancelButtonText = "No, cancel",
  onConfirm = () => {},
  onCancel = () => {},
  title = "Do irreversible thing?",
  body = "Here are some consequences you might not have considered.",
  intent = "primary",
  defaultOpen = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col space-y-4">
            <p>{body}</p>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            intent="neutral"
            size="md"
            onClick={() => {
              onCancel();
              setIsOpen(false);
            }}
            children={cancelButtonText}
          />
          <Button
            intent={intent}
            size="md"
            onClick={() => {
              onConfirm();
              setIsOpen(false);
            }}
            children={confirmButtonText}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type Props = {
  confirmButtonText?: React.ReactNode;
  cancelButtonText?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  title?: string;
  body?: string;
  intent?: "primary" | "danger" | "neutral";
  defaultOpen?: boolean;
};
