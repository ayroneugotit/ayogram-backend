import { ContainerModule } from 'inversify';

import type { IAppConfig } from '../core/app/app.config.interface.js';
import { AppConfig } from '../core/app/app.config.js';
import type { IApp } from '../core/app/app.interface.js';
import { App } from '../core/app/app.js';
import type { IErrorHandler } from '../core/handlers/error/error.handler.interface.js';
import { ErrorHandler } from '../core/handlers/error/error.handler.js';
import type { INotFoundHandler } from '../core/handlers/notfound/notfound.handler.interface.js';
import { NotFoundHandler } from '../core/handlers/notfound/notfound.handler.js';
import { IDENTIFIERS } from '../core/identifiers.js';
import type { IMiddleware } from '../core/middlewares/middleware.interface.js';
import { ShapingMiddleware } from '../core/middlewares/shaping/shaping.middleware.js';
import { PrismaDatabase } from '../infrastructure/database/prisma.database.js';

export function createAppContainerModule(): ContainerModule {
    return new ContainerModule((options) => {
        const { bind } = options;
        bind<IApp>(IDENTIFIERS.App).to(App).inSingletonScope();
        bind<IAppConfig>(IDENTIFIERS.AppConfig).to(AppConfig).inSingletonScope();
        bind<IMiddleware>(IDENTIFIERS.ShapingMiddleware).to(ShapingMiddleware).inSingletonScope();
        bind<INotFoundHandler>(IDENTIFIERS.NotFoundHandler).to(NotFoundHandler).inSingletonScope();
        bind<IErrorHandler>(IDENTIFIERS.ErrorHandler).to(ErrorHandler).inSingletonScope();
        bind<PrismaDatabase>(IDENTIFIERS.PrismaDatabase).to(PrismaDatabase).inSingletonScope();
    });
}
