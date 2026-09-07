# Architecture

FlowForge AI is a **modular monolith**: one deployable Next.js application with explicit domain modules. That keeps local development, transactions, and operational overhead simple for an MVP, while still making it possible to extract a module later if a boundary proves independently scalable.

## Why a modular monolith

- Workflows, executions, organizations, and auth share a transactional data model.
- A single Postgres database and a single Redis/BullMQ cluster are enough until traffic or team scale says otherwise.
- Module folders and public `index.ts` barrels are cheaper than network boundaries.
- Extracting a module later is possible because domain logic is not embedded in React trees or route handlers.

This codebase is **not** a microservices system. Background workers will run as additional processes against the same modules, database, and queues.

## Module boundaries

Domain modules live under `src/modules/`:

| Module          | Responsibility                                       |
| --------------- | ---------------------------------------------------- |
| `auth`          | Identity and session contracts (not implemented yet) |
| `organizations` | Tenants, membership, roles                           |
| `workflows`     | Workflow definitions                                 |
| `executions`    | Async workflow runs                                  |
| `integrations`  | Third-party connectors and webhooks                  |
| `ai`            | Model provider jobs (not implemented yet)            |

Each module may include:

- `domain/` — entities, unions, business rules, domain errors, contracts
- `application/` — use cases, Zod schemas/DTOs, orchestration
- `infrastructure/` — repositories and adapters (add when persistence exists)
- `presentation/` — route adapters and server actions
- `index.ts` — the only import surface other modules should use

Do not add empty layers. If a module has no database yet, skip `infrastructure/`.

## Dependency direction

Dependencies point inward:

```
app / presentation → application → domain
infrastructure → domain
lib / db → used by application and infrastructure, never by domain
```

Rules:

- Domain modules must not import Next.js, React, Drizzle clients, Redis, or BullMQ.
- Route handlers stay thin: validate, call a use case, map the result.
- Other modules import from `@/modules/<name>`, not from deep internal paths.
- Shared kernel (`src/lib/errors`, `src/lib/env`, `src/lib/logger`) is allowed from application and infrastructure layers.

## Database access

- Schema lives in `src/db/schema/`.
- The Drizzle client is a singleton in `src/db/client.ts`.
- Queries belong in module `infrastructure/` repositories once tables exist.
- API responses should use application/domain types, not raw table rows, unless that is an intentional internal contract.
- The current schema is a minimal `schema_meta` table plus `SELECT 1` health checks. Product tables are intentionally absent.

## Queues

- Redis connection options and a shared client live in `src/lib/redis`.
- Queue names and lazy `Queue` creation live in `src/lib/queue/queues`.
- `createWorker` in `src/lib/queue/workers` is a factory. Workers are **not** started by the Next.js web process.
- Future queues (`workflow-execution`, `webhooks`) are named but have no processors yet.

When workflow execution is built, add a worker entrypoint (for example `src/workers/workflow-execution.ts`) that imports the executions application layer and `createWorker`.

## How to add a new module

1. Create `src/modules/<name>/domain` with types and errors.
2. Add Zod schemas in `application/` and infer TypeScript types from them.
3. Put use cases in `application/`. Keep them free of HTTP details.
4. Add `infrastructure/` only when you persist or call an external service.
5. Expose a small public API from `index.ts`.
6. Wire a thin route under `src/app/api/...` or a presentation adapter.

## Error and API shape

Unexpected errors are logged server-side and returned as:

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred."
  }
}
```

Expected `AppError` values keep their machine-readable `code`, human-readable `message`, and HTTP status. Success responses use `{ "data": ... }`.
