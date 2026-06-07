import type { Context } from 'hono';
import { injectable } from 'inversify';

import { HTTPError } from '../../errors/http.error.js';
import type { INotFoundHandler } from './notfound.handler.interface.js';

@injectable()
export class NotFoundHandler implements INotFoundHandler {
    public handle(c: Context): Response {
        throw new HTTPError({
            message: 'not found',
            logMessage: `handler for ${c.req.path} not found`,
            status: 404,
            source: this.constructor.name,
        });
    }
}
