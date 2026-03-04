import { useClient } from "@dxos/react-client"
import { useIdentity } from "@dxos/react-client/halo"
import { useState } from "react"
import { useNavigate } from "react-router"
import { TeamNameForm } from "ui/TeamNameForm"
import { createClients } from "~/data/clients"
import { createContacts, findContactData } from "~/data/contacts"
import { createProjects } from "~/data/projects"
import { useLocalState } from "~/hooks/useLocalState"
import { useRedirect } from "~/hooks/useRedirect"
import { makeContact } from "~/schema/Contact"

export default function AuthCreatePage() {
  const identity = useIdentity()
  const navigate = useNavigate()
  const client = useClient()
  const { spaceKey, update } = useLocalState()
  const [isCreating, setIsCreating] = useState(false)

  // Hooks ↑

  useRedirect({
    from: "/auth/setup/create",
    to: "/auth/begin",
    condition: !identity?.profile?.displayName,
  })

  // Already have a team
  useRedirect({
    from: "/auth/setup/create",
    to: "/",
    condition: Boolean(spaceKey) && !isCreating,
  })

  const defaultTeamName = "DevResults"

  return (
    <TeamNameForm
      teamName={defaultTeamName}
      onSubmit={async ({ teamName }) => {
        setIsCreating(true)
        try {
          // Create a space with the team name
          const space = await client.spaces.create({ name: teamName })
          await space.waitUntilReady()

          // Build a contact for yourself, using seed data if available
          const displayName = identity!.profile!.displayName!
          const seedData = teamName === defaultTeamName ? findContactData(displayName) : undefined
          const contact = makeContact({
            identity: identity!,
            avatarUrl: seedData?.avatarUrl ?? "",
            firstName: seedData?.firstName ?? displayName,
            lastName: seedData?.lastName ?? "",
            userName: seedData?.userName ?? displayName,
          })
          space.db.add(contact)

          // Seed team members (excluding yourself) when creating the DevResults team
          if (teamName === defaultTeamName) {
            for (const c of createContacts(displayName)) {
              space.db.add(c)
            }
          }

          // Seed projects and clients
          for (const project of createProjects()) {
            space.db.add(project)
          }

          for (const c of createClients()) {
            space.db.add(c)
          }

          // Ensure data is queryable before navigating
          await space.db.flush()

          // Persist selected space and navigate to the app
          update({ spaceKey: space.id })
          void navigate("/")
        } finally {
          setIsCreating(false)
        }
      }}
    />
  )
}
