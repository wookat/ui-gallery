# apps/primevue

PrimeVue (Vue 3) reference implementation of the UI Gallery page spec.

- PrimeVue `4.5.5` (MIT) with the official `@primeuix/themes` Aura preset, styled mode, `darkModeSelector: ".dark"`.
- Icons default to PrimeIcons (`?icons=native`); `?icons=lucide|tabler|phosphor|heroicons` (alias `?icon=`) switch to the Vue icon packages.
- Fonts: `?font=default|inter|geist|noto-sans-sc|lxgw-wenkai` (self-hosted OFL packages).
- All copy comes from `@ui-gallery/spec/mock/*.json`.

```sh
pnpm --filter primevue dev
pnpm --filter primevue lint && pnpm --filter primevue typecheck && pnpm --filter primevue build
node scripts/sync-gallery.mjs   # regenerate gallery.json.coverage from src/coverage.ts
```
