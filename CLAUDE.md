# XDev on DXOS

A local-first team collaboration app for tracking time entries, daily accomplishments ("dones"), team members, and projects. Built on DXOS for real-time synchronization across devices.

## Tech Stack

- **Framework**: React 18 + React Router 7 (SPA mode)
- **Build**: Vite + TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Tabler (auto-imported via unplugin-icons)
- **Fonts**: IBM Plex (Sans, Serif, Mono, Condensed)
- **Data**: DXOS (decentralized sync) + Effect/Schema (validation)
- **Testing**: Vitest (unit) + Playwright (E2E) + Storybook (components)

## Project Structure

```
app/
├── routes/              # React Router v7 routes (flat routes convention)
│   ├── auth+/           # Authentication
│   ├── _private+/       # Protected routes
│   │   ├── hours+/      # Time tracking
│   │   ├── dones+/      # Daily accomplishments
│   │   ├── myweek+/     # Weekly view
│   │   ├── team+/       # Team management
│   │   └── settings+/   # User settings
├── schema/              # DXOS data models (TimeEntry, DoneEntry, Contact, Project, Client, Invitation)
├── ui/                  # React components
│   └── shadcn/          # shadcn/ui primitives
├── hooks/               # Custom hooks (useDatabase, useTeam, useLocalState, etc.)
├── lib/                 # Utilities (date, time, CSV parsing)
├── data/                # Static/seed data
└── types/               # TypeScript types
test/                    # Playwright E2E tests
```

## Key Files

| File                                         | Purpose                                               |
| -------------------------------------------- | ----------------------------------------------------- |
| [root.tsx](app/root.tsx)                     | Root layout, DXOS ClientProvider, schema registration |
| [useDatabase.tsx](app/hooks/useDatabase.tsx) | Main hook for querying DXOS space                     |
| [schema/](app/schema/)                       | Data models with Effect/Schema validation             |
| [vite.config.ts](vite.config.ts)             | Build config with PWA, icons, WASM                    |

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm test         # Run Vitest
pnpm test:pw      # Run Playwright tests
pnpm storybook    # Component documentation
pnpm lint         # XO linter
pnpm lint:fix     # Auto-fix lint issues (run after every change)
```

## Testing

- **Unit tests**: `*.test.ts` files, run with `pnpm test`
- **E2E tests**: Playwright in `test/` directory
  - Use visible text, roles, labels for selectors
  - Use `data-*` attributes when needed
  - Clear storage between tests for isolation

## Code Conventions

- Named exports (no default exports except routes)
- Props type at end of component files
- One component/function per file
- Use `cx()` for combining class names
- Sentence case for button text, headings, labels
- Test files: `foo.test.ts`

## DXOS Patterns

- Schema types registered in [root.tsx](app/root.tsx)
- Query data via `useQuery()` from `@dxos/react-client/echo`
- Space accessed via `useDatabase()` hook
- Objects are reactive (CRDT-backed)

When debugging dxos-related things, you can reference the local copy of the dxos monorepo at ~/code/dxos/dxos

### DXOS debug logs

Enable debug logging in the browser console:

```js
localStorage.dxlog = '{ "filter": "debug" }'
```

Then refresh the page. To filter to specific modules, use pattern matching:

```js
// Debug for echo-related code, info for everything else
localStorage.dxlog = '{ "filter": "echo:debug,info" }'

// Multiple patterns
localStorage.dxlog = '{ "filter": "client:debug,mesh:debug,info" }'
```

To turn it off:

```js
delete localStorage.dxlog
```

The filter patterns match against file paths, so `echo` matches any source file with "echo" in its path.
