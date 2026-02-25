import { DeviceKind, useDevices, useIdentity } from "@dxos/react-client/halo"
import {
  HaloSpaceMember,
  Filter,
  useQuery,
  useSpace,
  type SpaceMember,
} from "@dxos/react-client/echo"
import { useMulticastObservable } from "@dxos/react-client"
import { useMemo } from "react"
import { getContactInvitation } from "./getContactInvitation"
import { getInvitationStatus } from "./getInvitationStatus"
import { useLocalState } from "./useLocalState"
import { Contact, extendContact } from "~/schema/Contact"
import { Invitation } from "~/schema/Invitation"

// Create a stable empty observable for when space.members is undefined
// The empty array must be cached (same reference) to avoid infinite re-render loops
const EMPTY_MEMBERS: SpaceMember[] = []
const createEmptyObservable = () => ({
  get: () => EMPTY_MEMBERS,
  subscribe: () => ({ unsubscribe() {} }),
})

/**
 * Takes our auth state and builds a bunch of useful derived state about the user and team.
 */
export const useTeam = () => {
  const identity = useIdentity()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)
  // Use space.members directly instead of useMembers hook which has issues finding the space
  const emptyObservable = useMemo(createEmptyObservable, [])
  // Cast needed because our minimal observable doesn't have all MulticastObservable properties,
  // but useMulticastObservable only uses get() and subscribe()
  const members: SpaceMember[] =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    useMulticastObservable((space?.members ?? emptyObservable) as any) ?? []
  const rawContacts = useQuery(space, Filter.type(Contact))
  const invitations = useQuery(space, Filter.type(Invitation))
  const contacts = rawContacts.map(c => {
    const member = members.find(m => m.identity.identityKey.toString() === c.identityId)
    const isAdmin = member?.role === HaloSpaceMember.Role.OWNER
    const isSelf = member?.identity.identityKey.toString() === identity?.identityKey.toString()
    const invitation = getContactInvitation(c.id, invitations)
    return extendContact({
      contact: c,
      isAdmin,
      isSelf,
      identity: member?.identity,
      invitation,
      invitationStatus: getInvitationStatus(invitation),
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
