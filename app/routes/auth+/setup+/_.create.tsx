import { useNavigate } from "react-router"
import { useIdentity } from "@dxos/react-client/halo"
import { type Client, useClient } from "@dxos/react-client"
import { TeamNameForm } from "ui/TeamNameForm"
import { useLocalState } from "~/hooks/useLocalState"
import { useRedirect } from "~/hooks/useRedirect"
import { makeContact } from "~/schema/Contact"
import { createProjects } from "~/data/projects"
import { createClients } from "~/data/clients"

export default function AuthCreatePage() {
  const identity = useIdentity()
  const navigate = useNavigate()
  const client = useClient()
  const { spaceKey, update } = useLocalState()

  // Hooks ↑

  useRedirect({
    from: "/auth/setup/create",
    to: "/auth/begin",
    condition: !identity?.profile?.displayName,
  })

  // Already have a team
  useRedirect({ from: "/auth/setup/create", to: "/", condition: Boolean(spaceKey) })

  const defaultTeamName = "DevResults"

  return (
    <TeamNameForm
      teamName={defaultTeamName}
      onSubmit={async ({ teamName }) => {
        // Create a space with the team name
        const space = await client.spaces.create({ name: teamName })
        update({ spaceKey: space.key })
        await space.waitUntilReady()

        // Build a contact for yourself
        const contact = makeContact({
          identityId: identity!.identityKey.toString(),
          avatarUrl: "",
          firstName: identity!.profile!.displayName!,
          lastName: "",
          userName: identity!.profile!.displayName!,
        })
        space.db.add(contact)

        // Seed projects and clients
        for (const project of createProjects()) {
          space.db.add(project)
        }

        for (const c of createClients()) {
          space.db.add(c)
        }

        // Navigate to the app
        void navigate("/")
      }}
    />
  )
}
