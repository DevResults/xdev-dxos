import { DeviceKind, useDevices, useIdentity } from "@dxos/react-client/halo"
import { HaloSpaceMember, Filter, useMembers, useQuery, useSpace } from "@dxos/react-client/echo"
import { useLocalState } from "./useLocalState"
import { Contact, ExtendedContact } from "~/schema/Contact"

/**
 * Takes our auth state and builds a bunch of useful derived state about the user and team.
 */
export const useTeam = () => {
  const identity = useIdentity()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)
  const members = useMembers(space?.id)
  const contacts = useQuery(space, Filter.type(Contact)).map(c => {
    const member = members.find(m => m.identity.identityKey.toString() === c.identityId)
    const isAdmin = member?.role === HaloSpaceMember.Role.OWNER
    const isSelf = member?.identity.identityKey.toString() === identity?.identityKey.toString()
    return new ExtendedContact({
      contact: c,
      isAdmin,
      isSelf,
      identity: member?.identity,
    })
  })
  const devices = useDevices()
  const device = devices.find(d => d.kind === DeviceKind.CURRENT)
  const self = contacts.find(d => d.isSelf)!

  return {
    self,
    device,
    devices,
    contacts,
  }
}
