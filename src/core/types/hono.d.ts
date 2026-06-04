import 'hono';

import type { ContentfulStatusCode } from 'hono/utils/http-status';

import type { JWTPayload } from './jwt.payload.ts';

declare module 'hono' {
    interface Context {
        shape: <T extends object>(options: {
            message: string;
            data?: T;
            status?: ContentfulStatusCode;
        }) => Response;
    }

    interface ContextVariableMap {
        payload: JWTPayload;
    }
}
