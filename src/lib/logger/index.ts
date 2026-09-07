import { getEnv, type NodeEnv } from "@/lib/env";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogContext = Readonly<Record<string, unknown>>;

type Logger = {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
};

function shouldLog(level: LogLevel, nodeEnv: NodeEnv): boolean {
  if (nodeEnv === "production") {
    return level !== "debug";
  }

  return true;
}

function write(level: LogLevel, message: string, context?: LogContext): void {
  let nodeEnv: NodeEnv = "development";

  try {
    nodeEnv = getEnv().NODE_ENV;
  } catch {
    nodeEnv = nodeEnvSchemaFallback();
  }

  if (!shouldLog(level, nodeEnv)) {
    return;
  }

  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context ? { context } : {}),
  };

  const serialized = JSON.stringify(payload);

  switch (level) {
    case "debug":
      console.debug(serialized);
      break;
    case "info":
      console.info(serialized);
      break;
    case "warn":
      console.warn(serialized);
      break;
    case "error":
      console.error(serialized);
      break;
  }
}

function nodeEnvSchemaFallback(): NodeEnv {
  const value = process.env.NODE_ENV;
  if (value === "production" || value === "test" || value === "development") {
    return value;
  }

  return "development";
}

export const logger: Logger = {
  debug(message, context) {
    write("debug", message, context);
  },
  info(message, context) {
    write("info", message, context);
  },
  warn(message, context) {
    write("warn", message, context);
  },
  error(message, context) {
    write("error", message, context);
  },
};
