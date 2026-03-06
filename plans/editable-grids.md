# Editable Client & Project Grids

## Context

The Client and Project pages under Team are currently `<ComingSoon>` placeholders. We need to replace them with editable grids using TanStack Table, allowing inline editing of all fields. DXOS objects are reactive CRDTs, so we mutate them directly on blur — no local state management needed.

## Install

```bash
pnpm add @tanstack/react-table
```

## New Files

| File                              | Purpose                                             |
| --------------------------------- | --------------------------------------------------- |
| `app/ui/EditableTextCell.tsx`     | Click-to-edit text input cell                       |
| `app/ui/EditableCheckboxCell.tsx` | Checkbox cell for booleans                          |
| `app/ui/EditableTable.tsx`        | Generic table shell using TanStack Table + CSS grid |
| `app/ui/ClientsTable.tsx`         | Client column defs + add/delete logic               |
| `app/ui/ProjectsTable.tsx`        | Project column defs + add/delete logic              |

## Modified Files

| File                                                 | Change                                        |
| ---------------------------------------------------- | --------------------------------------------- |
| `app/routes/_private+/team+/clients+/_clients.tsx`   | Replace `<ComingSoon>` with `<ClientsTable>`  |
| `app/routes/_private+/team+/projects+/_projects.tsx` | Replace `<ComingSoon>` with `<ProjectsTable>` |

## Component Design

### EditableTextCell

- Shows plain text; click to switch to `<input>`
- On blur: call `onSave(value)`, exit edit mode
- On Enter: blur (triggers save)
- On Escape: revert to original, exit edit mode
- Props: `{ value: string, onSave: (value: string) => void }`

### EditableCheckboxCell

- Renders shadcn `Checkbox`
- On change: call `onSave(checked)` immediately
- Props: `{ value: boolean, onSave: (value: boolean) => void }`

### EditableTable

- Takes TanStack `ColumnDef[]` + DXOS data array
- Uses `useReactTable` with `getCoreRowModel()`
- Renders as CSS grid (matching Members page pattern)
- Header row: `font-medium text-neutral-500 text-xs uppercase tracking-wider`
- Body rows: `border-b p-2`, subgrid for column alignment
- Each row has a delete button (trash icon, `opacity-10 hover:text-danger-500 hover:opacity-100`)
- Delete shows confirmation dialog before removing
- "Add" button below grid: `Button intent="primary" size="sm"` with `IconPlus`
- Props: `{ columns, data, onAdd, onDelete, addLabel, heading }`

### ClientsTable

Columns:
| Column | Field | Cell | Width |
|--------|-------|------|-------|
| Code | `code` | EditableTextCell | `8em` |
| Description | `description` | EditableTextCell | `1fr` |

- `onSave` mutates `row.original` directly (DXOS reactive)
- Add: `space.db.add(makeClient({ code: "", timestamp: new Date().toISOString() }))`
- Delete: `space.db.remove(client)` (with confirmation)

### ProjectsTable

Columns:
| Column | Field | Cell | Width |
|--------|-------|------|-------|
| Code | `code` | EditableTextCell | `6em` |
| Sub-code | `subCode` | EditableTextCell | `6em` |
| Full code | `fullCode` | Plain text (computed) | `8em` |
| Description | `description` | EditableTextCell | `1fr` |
| Requires client | `requiresClient` | EditableCheckboxCell | `min-content` |
| Color | `color` | EditableTextCell | `6em` |

- When `code` or `subCode` changes, also update `fullCode` via `makeFullCode()`
- Add: `space.db.add(makeProject({ code: "", fullCode: "", requiresClient: false, timestamp: new Date().toISOString() }))`
- Delete: `space.db.remove(project)` (with confirmation)

### Route Pages

Both follow the same pattern:

```tsx
export default function ClientsPage() {
  const { clients } = useDatabase()
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)
  return (
    <Pane>
      <ClientsTable clients={clients} space={space} />
    </Pane>
  )
}
```

## Key References

- `app/schema/Client.ts` — `makeClient`
- `app/schema/Project.ts` — `makeProject`, `makeFullCode`
- `app/hooks/useDatabase.tsx` — provides `clients`, `projects`
- `app/ui/Members.tsx` — grid styling and add/delete UX patterns
- `app/ui/layouts/Pane.tsx` — page content wrapper

## Implementation Order

1. Install `@tanstack/react-table`
2. `EditableTextCell.tsx` + tests
3. `EditableCheckboxCell.tsx`
4. `EditableTable.tsx`
5. `ClientsTable.tsx` + modify `_clients.tsx`
6. `ProjectsTable.tsx` + modify `_projects.tsx`
7. Manual verification in browser
8. `pnpm lint:fix && pnpm test`

## Verification

1. `pnpm dev` — navigate to Team > Clients and Team > Projects
2. Verify inline editing works (click cell, type, blur saves)
3. Verify Enter saves, Escape reverts
4. Verify Add button creates new row
5. Verify Delete shows confirmation then removes row
6. Verify Project fullCode updates when code/subCode changes
7. `pnpm test` — all tests pass
8. `pnpm lint:fix` — no lint errors
