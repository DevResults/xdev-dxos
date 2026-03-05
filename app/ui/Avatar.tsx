import { Avatar as _Avatar, AvatarImage, AvatarFallback, type AvatarSize } from "@ui/avatar"
import { displayFirstName } from "~/lib/displayFirstName"
import type { Contact } from "~/schema/Contact"

export function Avatar({ className = "", size = "md", contact }: Props) {
  return (
    <_Avatar size={size} className={className}>
      <AvatarImage src={contact.avatarUrl} />
      <AvatarFallback>
        {(displayFirstName(contact) ?? "ü").slice(0, 1).toLocaleUpperCase()}
      </AvatarFallback>
    </_Avatar>
  )
}

type Props = {
  className?: string
  size?: AvatarSize
  contact: Contact
}
