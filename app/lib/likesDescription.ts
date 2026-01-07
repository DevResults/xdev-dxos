import type { Contact } from "~/schema/Contact"

export function likesDescription(likes: Contact[], self: Contact) {
  const numberLikes = likes.length
  const sortedNames = likes.map(({ firstName }) => firstName).sort()
  const index = sortedNames.indexOf(self.firstName)
  if (index !== -1) {
    sortedNames.splice(index, 1)
    sortedNames.push("you")
  }

  let title = null
  switch (numberLikes) {
    case 1: {
      title = sortedNames[0]
      break
    }

    case 2: {
      title = sortedNames.join(" and ")
      break
    }

    default: {
      title = `${sortedNames.slice(0, numberLikes - 1).join(", ")}, and ${sortedNames[numberLikes - 1]}`
      break
    }
  }

  return title + " liked this"
}
