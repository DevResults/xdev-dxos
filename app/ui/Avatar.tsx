import { Avatar as _Avatar, AvatarImage, AvatarFallback, type AvatarSize } from "~/ui/shadcn/avatar";

export function Avatar({ className = "", size = "md", contact }: Props) {
  return (
    <_Avatar
      size={size}
      className={className}
    >
      <AvatarImage src={contact.avatarUrl} />
      <AvatarFallback>{contact.profile.displayName.slice(0, 1).toLocaleUpperCase()}</AvatarFallback>
    </_Avatar>
  );
}

type Props = {
  className?: string;
  size?: AvatarSize;
  contact: any;
};
