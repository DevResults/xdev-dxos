import type { Contact } from "~/schema/Contact"
import { Avatar as _Avatar, AvatarImage, AvatarFallback, type AvatarSize } from "@ui/avatar"

export function Avatar({ className = "", size = "md", contact }: Props) {
  return (
    <_Avatar size={size} className={className}>
      <AvatarImage src={contact.avatarUrl} />
      <AvatarFallback>{(contact.firstName ?? "ü").slice(0, 1).toLocaleUpperCase()}</AvatarFallback>
    </_Avatar>
  )
}

type Props = {
  className?: string
  size?: AvatarSize
  contact: Contact
}
