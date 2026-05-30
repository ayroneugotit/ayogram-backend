import { injectable } from 'inversify';

import { HTTPError } from '../../errors/http.error.js';
import type { INotFoundHandler } from './notfound.handler.interface.js';

@injectable()
export class NotFoundHandler implements INotFoundHandler {
    public handle(): Response {
        throw new HTTPError({ message: 'not found', status: 404 });
    }
}
