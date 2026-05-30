import type { Context } from 'hono';
import { injectable } from 'inversify';

import { HTTPError } from '../../errors/http.error.js';
import type { IErrorHandler } from './error.handler.interface.js';

@injectable()
export class ErrorHandler implements IErrorHandler {
    public handle(e: Error, c: Context): Response {
        if (e instanceof HTTPError) {
            return c.json({ message: e.message }, e.status);
        }
        return c.json({ message: 'internal server error' }, 500);
    }
}
