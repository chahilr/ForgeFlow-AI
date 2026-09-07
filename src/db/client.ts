import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/db/schema";
import { getEnv } from "@/lib/env";

export type Database = PostgresJsDatabase<typeof schema>;

type PostgresClient = ReturnType<typeof postgres>;

const globalForDb = globalThis as typeof globalThis & {
  postgresClient?: PostgresClient;
  drizzleDb?: Database;
};

function getPostgresClient(): PostgresClient {
  if (globalForDb.postgresClient) {
    return globalForDb.postgresClient;
  }

  const client = postgres(getEnv().DATABASE_URL, {
    max: getEnv().NODE_ENV === "production" ? 10 : 5,
  });

  globalForDb.postgresClient = client;
  return client;
}

export function getDb(): Database {
  if (globalForDb.drizzleDb) {
    return globalForDb.drizzleDb;
  }

  const db = drizzle(getPostgresClient(), { schema });
  globalForDb.drizzleDb = db;
  return db;
}
