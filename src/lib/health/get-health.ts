import { sql } from "drizzle-orm";

import { getDb } from "@/db";
import { getRedis } from "@/lib/redis";
import { logger } from "@/lib/logger";

export const HEALTH_STATUSES = ["ok", "unhealthy"] as const;
export const CHECK_STATUSES = ["up", "down"] as const;

export type HealthStatus = (typeof HEALTH_STATUSES)[number];
export type CheckStatus = (typeof CHECK_STATUSES)[number];

export type HealthChecks = {
  readonly database: CheckStatus;
  readonly redis: CheckStatus;
};

export type HealthResult = {
  readonly status: HealthStatus;
  readonly checks: HealthChecks;
};

async function checkDatabase(): Promise<CheckStatus> {
  try {
    await getDb().execute(sql`select 1`);
    return "up";
  } catch (error) {
    logger.error("Database health check failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return "down";
  }
}

async function checkRedis(): Promise<CheckStatus> {
  try {
    const redis = getRedis();
    if (redis.status === "wait") {
      await redis.connect();
    }

    const pong = await redis.ping();
    return pong === "PONG" ? "up" : "down";
  } catch (error) {
    logger.error("Redis health check failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return "down";
  }
}

export async function getHealth(): Promise<HealthResult> {
  const [database, redis] = await Promise.all([checkDatabase(), checkRedis()]);

  const status: HealthStatus =
    database === "up" && redis === "up" ? "ok" : "unhealthy";

  return {
    status,
    checks: { database, redis },
  };
}
