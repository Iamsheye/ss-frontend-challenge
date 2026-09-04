# syntax=docker/dockerfile:1
#
# Multi-stage Dockerfile for the Next.js application.
#
# Stages:
#   - deps:        installs all npm dependencies (cached unless package*.json changes)
#   - development: runs `next dev` with hot-reload (default for docker-compose.yml)
#   - builder:     creates an optimized production build (`next build`)
#   - prod-deps:   installs production-only dependencies for the runtime image
#   - production:  serves the production build (`next start`)
#
# Default target is `development` so that `docker compose up` starts a
# dev server without extra flags. Use `--target production` (or the
# `prod` compose profile) for a production image.

ARG NODE_VERSION=22-alpine

# ---------------------------------------------------------------------------
# Base image shared by all stages
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---------------------------------------------------------------------------
# Install dependencies
# ---------------------------------------------------------------------------
FROM base AS deps
# libc6-compat is required by Next.js / SWC on Alpine.
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------------------
# Development image: `next dev` with hot-reload
# ---------------------------------------------------------------------------
FROM base AS development
ENV NODE_ENV=development
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
# Polling fallbacks make file watching reliable on Docker Desktop
# (macOS / Windows) where inotify events don't always propagate.
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]

# ---------------------------------------------------------------------------
# Build the optimized production bundle
# ---------------------------------------------------------------------------
FROM base AS builder
ENV NODE_ENV=production
ARG NEXT_PUBLIC_API_BASE_URL=https://api-challenge.starsoft.games/api/v1
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------------------------------------------------------------------------
# Production-only dependencies (slim runtime for `next start`)
# ---------------------------------------------------------------------------
FROM base AS prod-deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---------------------------------------------------------------------------
# Production image: serves `next start`
# ---------------------------------------------------------------------------
FROM base AS production
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=prod-deps /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000
CMD ["npm", "run", "start", "--", "-H", "0.0.0.0", "-p", "3000"]
