import { DeviceKind, useDevices, useIdentity } from "@dxos/react-client/halo"
import { Filter, useQuery, useSpace, type SpaceMember } from "@dxos/react-client/echo"
import { type MulticastObservable, useMulticastObservable } from "@dxos/react-client"
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
  const emptyObservable = useMemo(createEmptyObservable, [])
  /* eslint-disable @typescript-eslint/no-unsafe-argument -- fake observable only implements get/subscribe */
  const members: SpaceMember[] =
    useMulticastObservable(
      (space?.members ?? emptyObservable) as MulticastObservable<SpaceMember[]>,
    ) ?? []
  /* eslint-enable @typescript-eslint/no-unsafe-argument */
  const rawContacts = useQuery(space, Filter.type(Contact))
  const invitations = useQuery(space, Filter.type(Invitation))
  const contacts = rawContacts.map(c => {
    const member = members.find(m => m.identity.identityKey.toString() === c.identityId)
    const invitation = getContactInvitation(c.id, invitations)
    return extendContact({
      contact: c,
      member,
      selfIdentity: identity ?? undefined,
      invitation,
      invitationStatus: getInvitationStatus(invitation),
    })
  })
  const devices = useDevices()
  const device = devices.find(d => d.kind === DeviceKind.CURRENT)
  const selfIdentityId = identity?.identityKey.toString()
  const self = contacts.find(d => d.identityId === selfIdentityId) ?? contacts.find(d => d.isSelf)!

  return {
    self,
    device,
    devices,
    contacts,
  }
}
