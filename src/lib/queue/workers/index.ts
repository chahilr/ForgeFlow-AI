import { Worker, type Processor, type WorkerOptions } from "bullmq";

import { getBullmqConnection } from "@/lib/redis";
import type { QueueName } from "../queues/names";

export function createWorker<T>(
  name: QueueName,
  processor: Processor<T>,
  options?: Omit<WorkerOptions, "connection">,
): Worker<T> {
  return new Worker<T>(name, processor, {
    ...options,
    connection: getBullmqConnection(),
  });
}
