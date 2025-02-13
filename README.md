# XDev: Project X for DevResults

This is an experiment to see if we can get [XDev](https://github.com/DevResults/xdev) running on [DXOS](https://dxos.org/)

## Running locally

1. Clone this repo
2. Open VS Code and click "install" for VS Code recommended extensions
3. Install pnpm if needed `npm i -g pnpm`, then

```
pnpm install
pnpm dev
```

This will start `vite` in parallel to build and launch the application with hot reloading after code changes.
Changes are synchronized automatically through the (currently free) DXOS infrastructure

## Notes

- You must be online at the same time to sync changes
- You have to manually adjust join links from dxos style ?spaceInvitationCode=<code> to xdev style /join/<code> to accept an invite
- The inviter must be online _ and looking at the invite screen _ to accept invites
