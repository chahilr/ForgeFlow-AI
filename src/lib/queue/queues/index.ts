import { Queue } from "bullmq";

import { getBullmqConnection } from "@/lib/redis";
import { QUEUE_NAMES, type QueueName } from "./names";

const globalForQueues = globalThis as typeof globalThis & {
  queues?: Map<QueueName, Queue>;
};

function getQueueMap(): Map<QueueName, Queue> {
  globalForQueues.queues ??= new Map<QueueName, Queue>();
  return globalForQueues.queues;
}

export function getQueue(name: QueueName): Queue {
  const queues = getQueueMap();
  const existing = queues.get(name);

  if (existing) {
    return existing;
  }

  const queue = new Queue(name, {
    connection: getBullmqConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: { count: 1000 },
      removeOnFail: { count: 5000 },
    },
  });

  queues.set(name, queue);
  return queue;
}

export function getDefaultQueue(): Queue {
  return getQueue(QUEUE_NAMES.default);
}

export { QUEUE_NAMES, type QueueName };
