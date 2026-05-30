import type { Context, Next } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { injectable } from 'inversify';

import type { IMiddleware } from '../middleware.interface.js';

@injectable()
export class ShapingMiddleware implements IMiddleware {
    public async handle(c: Context, n: Next): Promise<void> {
        c.shape = <T>({
            message,
            data,
            status = 200,
        }: {
            message: string;
            data?: T;
            status?: ContentfulStatusCode;
        }): Response => {
            return data ? c.json({ message, data }, status) : c.json({ message }, status);
        };

        await n();
    }
}
