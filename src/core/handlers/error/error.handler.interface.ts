import type { ErrorHandler } from 'hono';

export interface IErrorHandler {
    handle: ErrorHandler;
}
