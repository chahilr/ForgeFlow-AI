import Redis, { type RedisOptions } from "ioredis";
import type { ConnectionOptions } from "bullmq";

import { getEnv } from "@/lib/env";

const globalForRedis = globalThis as typeof globalThis & {
  redis?: Redis;
};

export function getRedisConnectionOptions(): RedisOptions {
  return {
    maxRetriesPerRequest: null,
  };
}

export function getBullmqConnection(): ConnectionOptions {
  return {
    url: getEnv().REDIS_URL,
    maxRetriesPerRequest: null,
  };
}

export function getRedis(): Redis {
  if (globalForRedis.redis) {
    return globalForRedis.redis;
  }

  const redis = new Redis(getEnv().REDIS_URL, {
    ...getRedisConnectionOptions(),
    lazyConnect: true,
  });

  globalForRedis.redis = redis;
  return redis;
}
