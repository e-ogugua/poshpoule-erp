/**
 * Debug utility for logging and error tracking
 */

export interface DebugLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  data?: any;
  userAgent?: string;
  url?: string;
}

class DebugLogger {
  private logs: DebugLog[] = [];
  private maxLogs = 100;

  log(level: DebugLog['level'], message: string, data?: any) {
    const logEntry: DebugLog = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    this.logs.push(logEntry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console logging
    const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
    console[consoleMethod](`[${level.toUpperCase()}] ${message}`, data || '');

    // Send to external service in production (if configured)
    if (level === 'error' && process.env.NODE_ENV === 'production') {
      this.sendToExternalService(logEntry);
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  getLogs(): DebugLog[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  private async sendToExternalService(logEntry: DebugLog) {
    try {
      // Could send to external logging service
      // await fetch('/api/logs', { method: 'POST', body: JSON.stringify(logEntry) });
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }
}

// Global debug logger instance
export const debugLogger = new DebugLogger();

// React hook for using debug logger
export function useDebugLogger() {
  return {
    log: debugLogger.info.bind(debugLogger),
    warn: debugLogger.warn.bind(debugLogger),
    error: debugLogger.error.bind(debugLogger),
    getLogs: debugLogger.getLogs.bind(debugLogger),
  };
}

// Utility for wrapping async functions with error handling
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context: string
): Promise<T> {
  try {
    debugLogger.info(`Starting ${context}`);
    const result = await fn();
    debugLogger.info(`Completed ${context}`);
    return result;
  } catch (error) {
    debugLogger.error(`Failed ${context}`, error);
    throw error;
  }
}

// Utility for wrapping API calls
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  endpoint: string
): Promise<T> {
  return withErrorHandling(apiCall, `API call to ${endpoint}`);
}
