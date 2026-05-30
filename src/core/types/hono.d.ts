import 'hono';

import type { ContentfulStatusCode } from 'hono/utils/http-status';

declare module 'hono' {
    interface Context {
        shape: <T extends object>(options: {
            message: string;
            data?: T;
            status?: ContentfulStatusCode;
        }) => Response;
    }
}
