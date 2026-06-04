import type { IMiddleware } from './middleware.interface.js';

export interface IMiddlewareFactory {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create: (...args: any[]) => IMiddleware;
}
