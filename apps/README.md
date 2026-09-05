# UI Gallery application template

`apps/shadcn-ui` is the first reference implementation and the reusable
starting point for future library adapters.

## Copy the template

1. Copy `apps/shadcn-ui` to `apps/<library-slug>`.
2. Change the package name, `gallery.json` metadata, and the Vite base path.
3. Keep the eight routes from `packages/spec/contract.json`.
4. Keep all mock content imported from `@ui-gallery/spec/mock/*.json`; do not
   fetch remote data from a rendered application.
5. Keep the shared URL controls: `theme`, `icons`, and `font`.
6. Replace only the library-specific components while retaining the shell,
   responsive behavior, and page contract.

## Required contract

Every application must provide `/login`, `/`, `/orders`, `/form`, `/settings`,
`/components`, `/landing`, and `/chat`. The application shell is shared by
all routes except login and landing. Use the mobile viewport in the contract
as a first-class target: tables must scroll within their card and navigation
must become a drawer.

## `gallery.json`

Update `gallery.json` with the library's actual version, repository, separate
GitHub/npm SPDX licenses, theme capabilities, route list, component coverage,
and external dependencies such as charts. Use `implemented`, `composed`, or
`missing` for every component key in `packages/spec/contract.json`.

## Build and screenshots

From the repository root:

```bash
pnpm install
pnpm --filter <package-name> lint
pnpm --filter <package-name> typecheck
pnpm --filter <package-name> build
node tools/shoot/shoot.mjs <slug>
node tools/assemble.mjs
```

The shooter captures every route at both contract viewports and both themes,
plus full-page component captures. PNGs belong under `shots/<slug>/` and are
ignored by Git; the assembled static gallery reads them from `dist/shots`.
