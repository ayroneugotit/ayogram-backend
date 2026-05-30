import { inject, injectable } from 'inversify';

import type { IErrorHandler } from '../handlers/error/error.handler.interface.js';
import type { INotFoundHandler } from '../handlers/notfound/notfound.handler.interface.js';
import { IDENTIFIERS } from '../identifiers.js';
import type { IMiddleware } from '../middlewares/middleware.interface.js';
import { AApp } from './abstract.app.js';
import type { IAppConfig } from './app.config.interface.js';

@injectable()
export class App extends AApp {
    public constructor(
        @inject(IDENTIFIERS.AppConfig) config: IAppConfig,
        @inject(IDENTIFIERS.ShapingMiddleware) shapingMiddlware: IMiddleware,
        @inject(IDENTIFIERS.NotFoundHandler) notFoundHandler: INotFoundHandler,
        @inject(IDENTIFIERS.ErrorHandler) errorHandler: IErrorHandler,
    ) {
        super(config, shapingMiddlware, notFoundHandler, errorHandler);
    }
}
