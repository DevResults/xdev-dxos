import type { Contact } from "~/schema/Contact"

export function likesDescription(likes: Contact[], self: Contact) {
  const numLikes = likes.length
  const sortedNames = likes.map(({ firstName }) => firstName).sort()
  const index = sortedNames.indexOf(self.firstName)
  if (index >= 0) {
    sortedNames.splice(index, 1)
    sortedNames.push("you")
  }

  let title = null
  switch (numLikes) {
    case 1: {
      title = sortedNames[0]
      break
    }

    case 2: {
      title = sortedNames.join(" and ")
      break
    }

    default: {
      title = `${sortedNames.slice(0, numLikes - 1).join(", ")}, and ${sortedNames[numLikes - 1]}`
      break
    }
  }

  return title + " liked this"
}
