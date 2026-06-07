import type { Context } from 'hono';
import { inject, injectable } from 'inversify';

import { HTTPError } from '../../errors/http.error.js';
import { IDENTIFIERS } from '../../identifiers.js';
import type { ILogger } from '../../loggers/logger.interface.js';
import type { IErrorHandler } from './error.handler.interface.js';

@injectable()
export class ErrorHandler implements IErrorHandler {
    public constructor(@inject(IDENTIFIERS.Logger) private readonly logger: ILogger) {}

    public handle(e: Error, c: Context): Response {
        if (e instanceof HTTPError) {
            if (e.logMessage) {
                this.logger.warn(e.source || '', `[${e.status}] ${e.logMessage}`);
            }
            return c.json({ message: e.message }, e.status);
        }
        this.logger.error('', `[500] ${e.message}`);
        return c.json({ message: 'internal server error' }, 500);
    }
}
