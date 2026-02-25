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

<!-- BEGIN BEADS INTEGRATION -->
## Issue Tracking with bd (beads)

**IMPORTANT**: This project uses **bd (beads)** for ALL issue tracking. Do NOT use markdown TODOs, task lists, or other tracking methods.

### Why bd?

- Dependency-aware: Track blockers and relationships between issues
- Git-friendly: Auto-syncs to JSONL for version control
- Agent-optimized: JSON output, ready work detection, discovered-from links
- Prevents duplicate tracking systems and confusion

### Quick Start

**Check for ready work:**

```bash
bd ready --json
```

**Create new issues:**

```bash
bd create "Issue title" --description="Detailed context" -t bug|feature|task -p 0-4 --json
bd create "Issue title" --description="What this issue is about" -p 1 --deps discovered-from:bd-123 --json
```

**Claim and update:**

```bash
bd update bd-42 --status in_progress --json
bd update bd-42 --priority 1 --json
```

**Complete work:**

```bash
bd close bd-42 --reason "Completed" --json
```

### Issue Types

- `bug` - Something broken
- `feature` - New functionality
- `task` - Work item (tests, docs, refactoring)
- `epic` - Large feature with subtasks
- `chore` - Maintenance (dependencies, tooling)

### Priorities

- `0` - Critical (security, data loss, broken builds)
- `1` - High (major features, important bugs)
- `2` - Medium (default, nice-to-have)
- `3` - Low (polish, optimization)
- `4` - Backlog (future ideas)

### Workflow for AI Agents

1. **Check ready work**: `bd ready` shows unblocked issues
2. **Claim your task**: `bd update <id> --status in_progress`
3. **Work on it**: Implement, test, document
4. **Discover new work?** Create linked issue:
   - `bd create "Found bug" --description="Details about what was found" -p 1 --deps discovered-from:<parent-id>`
5. **Complete**: `bd close <id> --reason "Done"`

### Auto-Sync

bd automatically syncs with git:

- Exports to `.beads/issues.jsonl` after changes (5s debounce)
- Imports from JSONL when newer (e.g., after `git pull`)
- No manual export/import needed!

### Important Rules

- ✅ Use bd for ALL task tracking
- ✅ Always use `--json` flag for programmatic use
- ✅ Link discovered work with `discovered-from` dependencies
- ✅ Check `bd ready` before asking "what should I work on?"
- ❌ Do NOT create markdown TODO lists
- ❌ Do NOT use external issue trackers
- ❌ Do NOT duplicate tracking systems

For more details, see README.md and docs/QUICKSTART.md.

<!-- END BEADS INTEGRATION -->

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
