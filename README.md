# ATMS Platform 2026

Automated Tour Management Solutions (ATMS) backend monorepo.

## What this repository is

This repository contains the ATMS API platform built on Next.js App Router + MongoDB/Mongoose, plus shared TypeScript types consumed by:

- `brubin1000/remix-of-tourlink-pro` (web frontend)
- `brubin1000/extension` (Chrome extension)

## Repository structure

```text
atms-platform-2026/
├── apps/
│   └── api/
├── packages/
│   └── shared-types/
├── docs/
├── package.json
└── README.md
```

## Quick start

```bash
npm install
npm run dev
```

## Environment setup

Copy `apps/api/.env.example` to `apps/api/.env.local` and set:

- `MONGODB_URI`
- `REDIS_URL`
- `GEMINI_API_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `STRIPE_SECRET_KEY`
- `POSTHOG_API_KEY`

## Key docs

- `docs/ARCHITECTURE.md`
- `docs/MASTER_BOARD.md`
- `docs/BACKEND_INTEGRATION.md`
- `docs/EXTENSION_INTEGRATION.md`
- `docs/OPEN_SOURCE_USED.md`
- `docs/SCHEMA.md`

## Cross-repo integration model

1. Frontend and extension send ingest/profile/show/payment data to this API.
2. This API normalizes and persists canonical records in MongoDB.
3. Shared contracts in `packages/shared-types` keep all repos aligned on response shapes.
