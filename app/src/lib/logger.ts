export type LogLevel = "info" | "warn" | "error";

export type LogMetadata = {
  action?: string;
  userId?: string | number;
  targetId?: string | number;
  success?: boolean;
  errorCode?: string;
  errorType?: string;
  requestId?: string;
  correlationId?: string;
  affectedCount?: number;
  resultCount?: number;
  // Allow additional structured fields but discourage sensitive data
  [key: string]: unknown;
};

export type LogEntry = {
  timestamp: string;
  level: LogLevel;
  message: string; // static message template, e.g. "create_post"
} & LogMetadata;

function emit(entry: LogEntry): void {
  // Single place where logs are actually written; easy to mock in tests.
  console.log(JSON.stringify(entry));
}

function baseEntry(level: LogLevel, message: string, metadata?: LogMetadata): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(metadata ?? {}),
  };
}

export function logInfo(message: string, metadata?: LogMetadata): void {
  emit(baseEntry("info", message, metadata));
}

export function logWarn(message: string, metadata?: LogMetadata): void {
  emit(baseEntry("warn", message, metadata));
}

export function logError(message: string, metadata?: LogMetadata): void {
  emit(baseEntry("error", message, metadata));
}
