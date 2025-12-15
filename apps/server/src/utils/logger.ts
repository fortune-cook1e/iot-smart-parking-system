type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogData {
  [key: string]: any;
}

class Logger {
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private log(level: LogLevel, message: string, data?: LogData): void {
    const logEntry = {
      timestamp: this.formatTimestamp(),
      level: level.toUpperCase(),
      message,
      ...(data && { data }),
    };

    const output = JSON.stringify(logEntry);

    switch (level) {
      case 'error':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      case 'debug':
        if (process.env.NODE_ENV === 'development') {
          console.debug(output);
        }
        break;
      default:
        console.log(output);
    }
  }

  info(message: string, data?: LogData): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: LogData): void {
    this.log('warn', message, data);
  }

  error(message: string, error?: Error | any, data?: LogData): void {
    const errorData = {
      ...data,
      ...(error && {
        error: {
          message: error.message,
          stack: error.stack,
          ...(error.code && { code: error.code }),
        },
      }),
    };
    this.log('error', message, errorData);
  }

  debug(message: string, data?: LogData): void {
    this.log('debug', message, data);
  }
}

export const logger = new Logger();
