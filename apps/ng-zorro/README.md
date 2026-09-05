# NG-ZORRO gallery adapter

Angular 22 adapter for the shared Acme Console gallery contract.

Routes: `/login`, `/`, `/orders`, `/form`, `/settings`, `/components`, `/landing`, `/chat`.

URL controls preserve `?theme=dark|light`, `?font=default|inter|geist|noto-sans-sc|lxgw-wenkai`,
and `?icons=native|lucide|tabler|phosphor|heroicons` (also `?icon=`).

```bash
pnpm --filter ng-zorro lint
pnpm --filter ng-zorro typecheck
pnpm --filter ng-zorro build
```
