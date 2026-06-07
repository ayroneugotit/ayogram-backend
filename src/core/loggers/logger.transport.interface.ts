import type { LogContext } from '../types/log.context.js';

export interface ILoggerTransport {
    info: (c: LogContext) => void;
    warn: (c: LogContext) => void;
    error: (c: LogContext) => void;
    fatal: (c: LogContext) => void;
}
