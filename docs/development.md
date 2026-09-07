# Local development

## Prerequisites

- Node.js 20 or later
- [pnpm](https://pnpm.io/) 9+ (this repo pins `packageManager` in `package.json`)
- Docker Desktop or another Docker engine with Compose

## Setup

From the repository root:

```bash
pnpm install
cp .env.example .env.local
cp .env.example .env
```

`.env.local` is loaded by Next.js. `.env` is used by Drizzle Kit.

## Environment variables

Validated in `src/lib/env`. Required today:

| Variable       | Purpose                                |
| -------------- | -------------------------------------- |
| `NODE_ENV`     | `development`, `test`, or `production` |
| `DATABASE_URL` | PostgreSQL connection string           |
| `REDIS_URL`    | Redis connection string                |

Do not read `process.env` outside `src/lib/env` and tooling config (`drizzle.config.ts`). Add new variables to the Zod schema first.

Never commit secrets. `.env` and `.env.local` are gitignored.

## PostgreSQL and Redis

```bash
docker compose up -d
docker compose ps
```

Compose starts:

- Postgres 17 on `localhost:5432` (`flowforge` / `flowforge` / `flowforge`)
- Redis 7 on `localhost:6379` with AOF persistence

Stop with `docker compose down`. Volumes persist data until you run `docker compose down -v`.

## Migrations

With Compose healthy and `DATABASE_URL` set:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

`db:generate` writes SQL under `src/db/migrations` from `src/db/schema`. `db:migrate` applies those files. The current schema is health-check oriented; do not add product tables until the next implementation slice.

## Run the application

```bash
pnpm dev
```

- Marketing: http://localhost:3000
- Dashboard shell: http://localhost:3000/dashboard
- Health: http://localhost:3000/api/health

`POST /api/workflows` validates input and returns `501` until the workflow use case is implemented.

## Tests and quality

```bash
pnpm test
pnpm test:watch
pnpm lint
pnpm typecheck
```

Unit tests live in `tests/unit`. Integration tests can be added under `tests/integration` and should assume Docker services when they need Postgres or Redis.
