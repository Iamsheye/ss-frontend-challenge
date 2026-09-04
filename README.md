# SS Frontend Challenge — NFT Marketplace

Next.js (App Router) + React + TypeScript storefront for the Starsoft
frontend challenge. See [CHALLENGE.md](./CHALLENGE.md) for the full
challenge spec.

## Implemented features

- **Product listing:** SSR-prefetched infinite list (`GET /products`,
  8 items per page) with load-more footer and real determinate progress
  (`loadedCount / totalCount`).
- **URL-synced pagination depth:** loaded page count is mirrored to
  `?page=N` via `router.replace` (no scroll reset), so refreshes and shared
  links restore list depth. The server reads `?page=N` and prefetches N pages.
- **Cart (Redux Toolkit):** add from product cards, quantity +/− (≤0 removes),
  remove per item, live total in ETH, empty state.
- **Cart drawer:** slide-in dialog with backdrop, Esc-to-close, focus trap +
  focus return, body scroll-lock, swipe-to-close, staggered item animations,
  all `prefers-reduced-motion` aware.
- **States:** SSR first paint (no spinner for initial view), skeleton while
  pending, error + retry UI, empty-list UI.
- **Checkout (mock):** `FINALIZAR COMPRA` plays a success animation then clears
  the cart. There is no checkout backend — this is a UI mock, not a purchase.

## Tech stack and rationale

- **Next.js 16 (App Router, Turbopack) · React 19 · TypeScript** — SSR via an
  async Server Component (`src/app/page.tsx`) that prefetches the TanStack
  Query infinite cache and hydrates via `HydrationBoundary`. This is the
  App Router equivalent of `getServerSideProps` (which does not exist in App
  Router). `loading.tsx` provides the Suspense fallback.
- **Redux Toolkit + react-redux** — global cart state (`addItem / removeItem / updateQuantity / clearCart`) with typed hooks. Cart-only scope matches the
  spec; server state stays in React Query.
- **TanStack React Query v5** — shared `infiniteProductsOptions()` used by both
  the server prefetch and `useInfiniteProducts`, so query keys never drift.
  `getNextPageParam` stops on `loadedSoFar >= count` or short pages.
- **Framer Motion** — drawer slide, list stagger, button feedback, rolling
  numbers. Gated behind `useReducedMotion` / `MotionConfig reducedMotion="user"`.
- **Styled Components + SASS** — component styles in co-located `*Styles.tsx`
  modules with CSS-var tokens; SASS for `globals.scss` / variables. No
  Tailwind in this project.
- **next/image + next/font** — optimized product/cart images (`remotePatterns`
  for the API image host) and self-hosted Poppins/IBM Plex Sans/Lato.
- **Dynamic import** — `CartDrawer` loads via `next/dynamic` with `ssr: false`
  (client-only: uses `document`, drag, focus management), keeping it out of
  the initial bundle.
- **ESLint + Prettier** — `npm run lint`, `npm run format` / `format:check`.
  Prettier uses the default config (`.prettierrc.json`)

## Prerequisites

- Node.js 20+ and npm (for local development), **or**
- Docker 24+ with Docker Compose v2 (for containerized development)
- Port `3000` free

## Environment variables

| Variable                   | Required | Default (see `.env.example`)                  |
| -------------------------- | -------- | --------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Yes      | `https://api-challenge.starsoft.games/api/v1` |

```bash
cp .env.example .env
```

Docker Compose already sets a default for this variable (overridable via
your local `.env`), so `docker compose up` works without extra steps. For
local runs, copy `.env.example` to `.env` first — without it the product
list renders an error state (`Missing NEXT_PUBLIC_API_BASE_URL`).

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
- **Stages in** `Dockerfile`**:** `deps` (all deps via `npm ci`) → `development`
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
- **API URL:** Compose provides a default `NEXT_PUBLIC_API_BASE_URL` (same
  value as `.env.example`); set it in a local `.env` (already git- and
  docker-ignored) to override.
- **Troubleshooting:** port conflict on `3000` → stop the other process or
  remap the port in `docker-compose.yml` (e.g. `"3001:3000"`); after changing
  `package.json`, rerun with `--build` to reinstall dependencies.

## Running locally (without Docker)

```bash
cp .env.example .env
npm ci
npm run dev
```

## Scripts

| Script                  | Purpose                                                   |
| ----------------------- | --------------------------------------------------------- |
| `npm run dev`           | Start the dev server (Turbopack)                          |
| `npm run build`         | Create a production build                                 |
| `npm run start`         | Serve the production build                                |
| `npm run lint`          | Run ESLint                                                |
| `npm run format`        | Format all files with Prettier                            |
| `npm run format:check`  | Check formatting without writing                          |
| `npm run test`          | Run Vitest unit + integration tests (single run)          |
| `npm run test:watch`    | Run Vitest in watch mode                                  |
| `npm run test:coverage` | Run Vitest with coverage (requires `@vitest/coverage-v8`) |

## Testing

Vitest + React Testing Library (`vitest.config.mts`, `vitest.setup.ts`).

- Unit: cart slice reducers, product query keys, infinite-query pagination
  (`getNextPageParam`), `apiFetch` / `fetchProducts` (fetch mocked).
- Integration (mocked React Query, real Redux store via `src/test-utils.tsx`):
  `ProductCard` (price formatting + add-to-cart), `LoadMore` (determinate
  progress + states), `CartDrawer` (quantities, remove, total, Esc/close),
  `Header` (badge count + drawer open/close), `HomeClient` (skeleton, error +
  retry, empty, grid + load-more, `?page=N` sync), `AnimatedButton` /
  `CheckoutButton` (success feedback + completion callbacks).

  Note: the spec asks for Jest; this repo uses Vitest instead. The API is
  intentionally Jest-compatible (`describe/it/expect` + React Testing
  Library), so the tests read like Jest tests while running an order of
  magnitude faster with native ESM/TypeScript support.

## Known limitations and future improvements

- **No product-detail route:** the challenge suggests dynamic routes for NFT
  details, but the Figma scope is listing + cart and the app implements only
  `/`. A `/products/[id]` route (SSR prefetch + `generateMetadata` for SEO)
  would be the natural next step if a detail design is added.
- **No Next.js API Routes:** none were needed — the app talks directly to the
  external Starsoft API via the `apiFetch` wrapper.
- **Mock checkout:** `FINALIZAR COMPRA` only plays a success animation and
  clears the cart; there is no checkout backend or order persistence.
- **Cart is in-memory only:** cart state lives in Redux and is lost on page
  reload. Persisting it (e.g. `localStorage` via `redux-persist` or a
  subscriber) would be a straightforward improvement.
- **Server prefetch capped at 5 pages:** `?page=N` values above 5 are clamped
  (`MAX_PREFETCH_PAGES` in `src/app/page.tsx`) to bound SSR work; deeper
  restores continue client-side.
- **No E2E tests:** coverage is unit + integration with mocked network. Adding
  Playwright flows (browse → add to cart → checkout) would cover the real API
  path.

## Tech stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Redux Toolkit ·  
TanStack Query v5 · Framer Motion · Styled Components + SASS
