import type { NotFoundHandler } from 'hono';

export interface INotFoundHandler {
    handle: NotFoundHandler;
}
