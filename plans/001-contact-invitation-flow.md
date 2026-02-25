# Invert Contact/Invitation Flow

## Context

Currently, users are invited to join the team, and when they accept the invitation, their contact record is auto-created from their DXOS identity. This means contacts start with minimal information (just firstName from displayName).

The user wants to invert this: create contacts first with full profile information (firstName, lastName, userName, avatarUrl), then invite each contact individually. When they join, they should be matched to their pre-created profile.

## Approach

**Matching Strategy:** Use DXOS invitation codes as the linking mechanism. Each invitation will be associated with a specific contact via a new `Invitation` schema.

**Flow:**

1. Admin creates contact with full profile (no identityId yet)
2. Admin invites that contact, creating both:
   - DXOS invitation (via `space.share()`)
   - Invitation record linking the code to the contact
3. User joins via invitation code
4. Join flow matches invitation code → finds contact → populates identityId
5. Invitation marked as ACCEPTED

**Backward Compatibility:** If no invitation record exists for a code (old flow or direct invites), fall back to auto-creating a contact from identity.

## Data Model Changes

### New Schema: Invitation

**File:** `app/schema/Invitation.ts`

```typescript
{
  contactId: string,        // Links to Contact.id
  invitationCode: string,   // DXOS invitation code
  dxosInvitationId: string, // DXOS internal ID for revocation
  status: "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED",
  createdAt: string,
  revokedAt?: string,
  acceptedAt?: string,
}
```

### Update Contact Schema

**File:** `app/schema/Contact.ts`

- Make `identityId` optional (it's populated only after join)
- Add `invitation` property to `ExtendedContact`
- Update `isMember` getter to check `Boolean(identityId)` instead of always returning true

### Register Schema

**File:** `app/root.tsx`

Add `Invitation` to the types array in ClientProvider.

## UI Changes

### 1. Contact Creation Form

**New file:** `app/routes/_private+/team+/members+/add.tsx`
**New file:** `app/ui/AddContactDialog.tsx`

Form with fields: firstName (required), lastName, userName (required), avatarUrl

### 2. Update Invitation Flow

**Rename:** `invite.tsx` → `invite.($contactId).tsx`

Changes:

- Accept contactId param
- Create DXOS invitation via `space.share()`
- Create Invitation record linking code to contact
- Update invitation record with code once available from `useInvitationStatus`

### 3. Update Members UI

**File:** `app/ui/Members.tsx`
**File:** `app/routes/_private+/team+/members+/_members.tsx`

- Add "Add contact" button → navigate to `/team/members/add`
- Change "Invite" button to navigate to `/team/members/invite/{contactId}`
- Show accurate status based on invitation records

### 4. Update Join Flow

**File:** `app/routes/auth+/setup+/_.join.($code).tsx`

After `space.waitUntilReady()`, instead of always creating a new contact:

1. Query for Invitation record matching the invitation code
2. If found:
   - Find linked contact by contactId
   - Update contact.identityId with joining user's identity
   - Mark invitation as ACCEPTED
3. If not found (backward compatibility):
   - Create new contact (current behavior)

### 5. Update useTeam Hook

**File:** `app/hooks/useTeam.tsx`

- Query Invitation records from space
- Pass invitation to ExtendedContact constructor
- ExtendedContact computes invitation status

### 6. Revoke Functionality

**New file:** `app/routes/_private+/team+/members+/revoke.($contactId).tsx`
**New file:** `app/ui/RevokeInvitationDialog.tsx`

- Find invitation by contactId
- Cancel DXOS invitation via `space.invitations.get()` → `cancel()`
- Update invitation record status to REVOKED

## Critical Files

| File                                                          | Change                                                    |
| ------------------------------------------------------------- | --------------------------------------------------------- |
| `app/schema/Invitation.ts`                                    | NEW - Invitation schema                                   |
| `app/schema/Contact.ts`                                       | Update - make identityId optional, update ExtendedContact |
| `app/root.tsx`                                                | Update - register Invitation schema                       |
| `app/routes/auth+/setup+/_.join.($code).tsx`                  | **CRITICAL** - Match invitation to contact on join        |
| `app/routes/_private+/team+/members+/invite.($contactId).tsx` | Rename & update - invite specific contact                 |
| `app/routes/_private+/team+/members+/add.tsx`                 | NEW - Add contact form                                    |
| `app/routes/_private+/team+/members+/revoke.($contactId).tsx` | NEW - Revoke invitation                                   |
| `app/ui/AddContactDialog.tsx`                                 | NEW - Contact creation form component                     |
| `app/ui/RevokeInvitationDialog.tsx`                           | NEW - Revoke confirmation dialog                          |
| `app/ui/Members.tsx`                                          | Update - Add contact button, invite per contact           |
| `app/routes/_private+/team+/members+/_members.tsx`            | Update - Add routing for add/invite/revoke                |
| `app/hooks/useTeam.tsx`                                       | Update - Include invitation data                          |

## Reusable Patterns

- Use `Contact.make()` factory for creating contacts (existing pattern)
- Use `useQuery(space, Filter.type(Invitation))` to query invitations
- Follow existing dialog patterns: `InviteMemberDialog`, `InviteDeviceDialog`
- Use React Router params for contactId: `useParams().contactId`

## Edge Cases

1. **User joins without pre-created contact:** Fall back to auto-create (backward compatibility)
2. **Duplicate contacts:** Check before creating, warn if userName already exists
3. **Failed joins:** Background job marks invitations EXPIRED after 7 days
4. **Contact deleted after invitation sent:** Join flow creates new contact if linked contact missing
5. **Multiple invitations for same contact:** Check for existing PENDING invitation before creating new one

## Verification

### Unit Tests

**File:** `app/schema/tests/Invitation.test.ts`

- Test `Invitation.make()` with valid data
- Test status transitions

### E2E Tests

**File:** `test/invitation-flow.test.ts`

1. Admin creates contact with firstName="Jane", lastName="Doe"
2. Admin invites Jane
3. Jane joins using invitation code
4. Verify Jane's contact has identityId populated
5. Verify invitation status is ACCEPTED
6. Verify Jane appears as "Member" in team list

**File:** `test/revoke-invitation.test.ts`

1. Admin creates contact and sends invitation
2. Admin revokes invitation
3. Verify invitation status is REVOKED
4. Verify contact shows "Invitation revoked"

**File:** `test/backward-compatibility.test.ts`

1. User joins without invitation record (simulate old flow)
2. Verify contact is auto-created
3. Verify user can access app

### Manual Testing Checklist

- [ ] Create contact without inviting
- [ ] Invite existing contact
- [ ] Join via new invitation (matches to contact)
- [ ] Join via code without record (auto-creates contact)
- [ ] Revoke invitation before join
- [ ] Contact shows: Not invited, Pending, Member, Revoked, Expired
- [ ] Cannot invite same contact twice while pending
- [ ] Run `pnpm lint:fix` after all changes
