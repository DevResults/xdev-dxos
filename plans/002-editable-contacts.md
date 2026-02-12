# Make contacts editable on the members page

## Context

Contacts on the team/members page are currently read-only after creation. Clicking a contact name should open an edit dialog where any team member can update any contact's information.

## Changes

### 1. `app/ui/EditContactDialog.tsx` (new)

Dialog component modeled on `AddContactDialog.tsx`. Differences:

- State initialized from `contact` prop (pre-filled)
- Title: "Edit contact"
- Submit button: "Save changes"
- Props: `{ onClose, onSubmit, contact: ExtendedContact, defaultOpen? }`

### 2. `app/routes/_private+/team+/members+/edit.($contactId).tsx` (new)

Route following the `revoke.($contactId).tsx` pattern:

- `useParams()` → contactId, `useTeam()` → find contact
- On submit: mutate DXOS object directly (`contact.contact.firstName = ...` etc.), `space.db.flush()`
- On close: `navigate("..")`

### 3. `app/ui/Members.tsx` (modify)

- Add `onEdit?: (contactId: string) => void` to Props
- Wrap contact name (line 89) in a `<button>` with `hover:underline` styling that calls `onEdit`

### 4. `app/routes/_private+/team+/members+/_members.tsx` (modify)

Wire `onEdit` to ``navigate(`/team/members/edit/${userId}`)``

### 5. Tests

- `app/ui/tests/EditContactDialog.test.ts` — unit tests for pre-fill, validation, submit
- E2E test in `test/team.test.ts` — click name → edit dialog → change value → verify update

## Verification

1. `pnpm test` — unit tests pass
2. `pnpm test:pw` — E2E tests pass
3. `pnpm lint:fix && pnpm format`
4. Manual: click a contact name, edit fields, save, confirm the grid updates
