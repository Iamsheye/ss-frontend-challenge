# SS Frontend Challenge — NFT Marketplace

Next.js (App Router) + React + TypeScript + Tailwind CSS storefront for the
Starsoft frontend challenge. See [CHALLENGE.md](./CHALLENGE.md) for the full
challenge spec.

## Prerequisites

- Node.js 20+ and npm (for local development), **or**
- Docker 24+ with Docker Compose v2 (for containerized development)
- Port `3000` free

## Running with Docker (recommended)

Single command:

```bash
docker compose up
```

Then open [http://localhost:3000](http://localhost:3000).

| Command                      | Purpose                                                     |
| ---------------------------- | ----------------------------------------------------------- |
| `docker compose up`          | Start the dev server with hot-reload                        |
| `docker compose up --build`  | Rebuild the image (after `Dockerfile` / dependency changes) |
| `docker compose up -d`       | Run in the background                                       |
| `docker compose logs -f web` | Follow the Next.js logs                                     |
| `docker compose down`        | Stop and remove containers                                  |

Production preview (optimized build served with `next start`):

```bash
docker compose --profile prod up --build web-prod
```

### Docker configuration specifics

- **Files:** `Dockerfile` (multi-stage), `docker-compose.yml` (orchestration),
  `.dockerignore` (build context exclusions).
- **Stages in `Dockerfile`:** `deps` (all deps via `npm ci`) → `development`
  (default, runs `next dev -H 0.0.0.0 -p 3000`) → `builder` (`npm run build`) →
  `prod-deps` (`npm ci --omit=dev`) → `production` (non-root `nextjs` user,
  serves `next start`). Base image is `node:22-alpine` (overridable with the
  `NODE_VERSION` build arg); `libc6-compat` is installed for Next.js/SWC on
  Alpine.
- **Only one service is required:** the Next.js app (`web`). No database or
  external infra exists, so there is nothing else to orchestrate.
- **Hot-reload:** source is bind-mounted (`.:/app`); `node_modules` and `.next`
  use anonymous volumes so the host never shadows or clobbers the container's
  copies.
- **Networking:** `HOSTNAME=0.0.0.0` plus the explicit `-H 0.0.0.0` flag so the
  dev server is reachable from outside the container.
- **File watching:** `CHOKIDAR_USEPOLLING=true` and `WATCHPACK_POLLING=true`
  make reloads reliable under Docker Desktop (macOS/Windows).
- **Telemetry:** `NEXT_TELEMETRY_DISABLED=1`.
- **No `.env` required:** no secrets are needed today; Compose already provides
  the dev vars. If API URLs/keys are added later, put them in a local `.env`
  (already git- and docker-ignored).
- **Troubleshooting:** port conflict on `3000` → stop the other process or
  remap the port in `docker-compose.yml` (e.g. `"3001:3000"`); after changing
  `package.json`, rerun with `--build` to reinstall dependencies.

## Running locally (without Docker)

```bash
npm ci
npm run dev
```

## Scripts

| Script          | Purpose                          |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the dev server (Turbopack) |
| `npm run build` | Create a production build        |
| `npm run start` | Serve the production build       |
| `npm run lint`  | Run ESLint                        |
| `npm run format` | Format all files with Prettier (incl. Tailwind class sorting) |
| `npm run format:check` | Check formatting without writing |

## Tech stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4
