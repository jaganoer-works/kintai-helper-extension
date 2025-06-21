import { LogLevel } from '../types';

export class Logger {
  private enableLogging: boolean;

  constructor(enableLogging: boolean = true) {
    this.enableLogging = enableLogging;
  }

  log(message: string, level: LogLevel = 'info'): void {
    if (!this.enableLogging) return;

    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}] ${level.toUpperCase()}`;
    const logMessage = `${prefix}: ${message}`;

    switch (level) {
      case 'error':
        console.error(logMessage);
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      default:
        console.log(logMessage);
    }
  }

  info(message: string): void {
    this.log(message, 'info');
  }

  warn(message: string): void {
    this.log(message, 'warn');
  }

  error(message: string): void {
    this.log(message, 'error');
  }

  setLoggingEnabled(enabled: boolean): void {
    this.enableLogging = enabled;
  }
} 