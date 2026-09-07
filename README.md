# FlowForge AI

Multi-tenant workflow automation platform. This repository currently contains the **MVP foundation**: a Next.js modular monolith with PostgreSQL, Redis, and background-job infrastructure.

It does **not** yet include authentication, the workflow engine, AI execution, or billing.

## Tech stack

- Next.js (App Router) and TypeScript
- Tailwind CSS
- PostgreSQL with Drizzle ORM
- Redis and BullMQ
- Zod, Vitest, ESLint, Prettier
- Docker Compose for local Postgres and Redis

## Quick start

```bash
pnpm install
cp .env.example .env.local
cp .env.example .env
docker compose up -d
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Health check: [http://localhost:3000/api/health](http://localhost:3000/api/health)

## Scripts

| Script             | Purpose                     |
| ------------------ | --------------------------- |
| `pnpm dev`         | Next.js development server  |
| `pnpm build`       | Production build            |
| `pnpm start`       | Start the production server |
| `pnpm lint`        | ESLint                      |
| `pnpm typecheck`   | TypeScript (`tsc --noEmit`) |
| `pnpm test`        | Vitest, single run          |
| `pnpm test:watch`  | Vitest, watch mode          |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate`  | Apply Drizzle migrations    |
| `pnpm db:studio`   | Open Drizzle Studio         |

## Documentation

- [Architecture](docs/architecture.md)
- [Local development](docs/development.md)
