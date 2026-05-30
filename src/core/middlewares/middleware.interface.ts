import type { MiddlewareHandler } from 'hono';

export interface IMiddleware {
    handle: MiddlewareHandler;
}
