# wwwroot — Turbo monorepo (labwebsite, site1, site2)
# portal/ is a SEPARATE repo outside wwwroot (see ../portal/README.md)

## Layout
```
(New folder (2))/
  wwwroot/              <- this turbo monorepo (git repo #1)
    apps/
      labwebsite/       <- Next.js :3000
      site1/            <- Next.js :3001
      site2/            <- Next.js :3002
    packages/
      ui/
      typescript-config/
  portal/               <- standalone Next.js :4000 (git repo #2, NOT in turbo)
```

## Prereqs
- Node >= 18
- pnpm 11.8.0 (`corepack enable`, or `npm i -g pnpm`)

## Quick start (monorepo only)
```sh
cd wwwroot
pnpm install
pnpm dev        # runs all 3 apps via turbo
# or single app:
pnpm --filter labwebsite dev
pnpm --filter site1 dev -- --port 3001
pnpm --filter site2 dev -- --port 3002
```

## Build
```sh
cd wwwroot
pnpm build
```

## Env
- Copy `wwwroot/.env.example` -> `wwwroot/.env`
- Copy each `apps/*/.env.example` -> `apps/*/.env.local` and adjust PORT / URL
- portal env lives in `../portal/.env.local` (separate)

## Portal (separate repo)
```sh
cd ../portal
pnpm install
pnpm dev -- --port 4000
```
