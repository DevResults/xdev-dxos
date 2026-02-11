import { describe, expect, test } from "vitest"
import { getContactMembershipDisplay } from "../getContactMembershipDisplay"

describe("getContactMembershipDisplay", () => {
  test("returns member labels for admins and members", () => {
    expect(
      getContactMembershipDisplay({
        isAdmin: true,
        isMember: true,
        invitationStatus: "NOT_INVITED",
      }),
    ).toEqual({
      statusLabel: "Admin",
      canInvite: false,
      canRevoke: false,
    })

    expect(
      getContactMembershipDisplay({
        isAdmin: false,
        isMember: true,
        invitationStatus: "NOT_INVITED",
      }),
    ).toEqual({
      statusLabel: "Member",
      canInvite: false,
      canRevoke: false,
    })
  })

  test("returns invitation labels and actions for non-members", () => {
    expect(
      getContactMembershipDisplay({ isAdmin: false, isMember: false, invitationStatus: "PENDING" }),
    ).toEqual({
      statusLabel: "Invitation pending",
      canInvite: false,
      canRevoke: true,
    })

    expect(
      getContactMembershipDisplay({ isAdmin: false, isMember: false, invitationStatus: "REVOKED" }),
    ).toEqual({
      statusLabel: "Invitation revoked",
      canInvite: true,
      canRevoke: false,
    })

    expect(
      getContactMembershipDisplay({ isAdmin: false, isMember: false, invitationStatus: "EXPIRED" }),
    ).toEqual({
      statusLabel: "Invitation expired",
      canInvite: true,
      canRevoke: false,
    })

    expect(
      getContactMembershipDisplay({
        isAdmin: false,
        isMember: false,
        invitationStatus: "NOT_INVITED",
      }),
    ).toEqual({
      statusLabel: "Not invited",
      canInvite: true,
      canRevoke: false,
    })
  })
})
