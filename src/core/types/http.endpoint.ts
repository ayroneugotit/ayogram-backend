import type { Handler } from 'hono';

import type { IMiddleware } from '../middlewares/middleware.interface.js';

type HTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type HTTPEndpoint = {
    handler: Handler;
    middlewares?: IMiddleware[];
    path?: string;
    method?: HTTPMethod;
};
