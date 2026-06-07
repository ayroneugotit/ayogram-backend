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
import type { ILogger } from '../core/loggers/logger.interface.js';
import { Logger } from '../core/loggers/logger.js';
import type { ILoggerTransport } from '../core/loggers/logger.transport.interface.js';
import { ConsoleLogger } from '../core/loggers/transports/console/console.logger.js';
import type { IMiddlewareFactory } from '../core/middlewares/middleware.factory.interface.js';
import type { IMiddleware } from '../core/middlewares/middleware.interface.js';
import { ShapingMiddleware } from '../core/middlewares/shaping/shaping.middleware.js';
import type { IJWTService } from '../core/security/jwt/jwt.service.interface.js';
import { JWTService } from '../core/security/jwt/jwt.service.js';
import type { IPasswordService } from '../core/security/password/password.service.interface.js';
import { PasswordService } from '../core/security/password/password.service.js';
import { PrismaDatabase } from '../infrastructure/database/prisma.database.js';
import { AuthenticationMiddleware } from '../shared/middlewares/authentication/authentication.middleware.js';
import { ValidationMiddlewareFactory } from '../shared/middlewares/validation/validation.middleware.js';

export function createAppContainerModule(): ContainerModule {
    return new ContainerModule((options) => {
        const { bind } = options;
        bind<IApp>(IDENTIFIERS.App).to(App).inSingletonScope();
        bind<IAppConfig>(IDENTIFIERS.AppConfig).to(AppConfig).inSingletonScope();
        bind<IMiddleware>(IDENTIFIERS.ShapingMiddleware).to(ShapingMiddleware).inSingletonScope();
        bind<INotFoundHandler>(IDENTIFIERS.NotFoundHandler).to(NotFoundHandler).inSingletonScope();
        bind<IErrorHandler>(IDENTIFIERS.ErrorHandler).to(ErrorHandler).inSingletonScope();
        bind<ILogger>(IDENTIFIERS.Logger).to(Logger).inSingletonScope();
        bind<ILoggerTransport>(IDENTIFIERS.ConsoleLogger).to(ConsoleLogger).inSingletonScope();
        bind<PrismaDatabase>(IDENTIFIERS.PrismaDatabase).to(PrismaDatabase).inSingletonScope();
        bind<IJWTService>(IDENTIFIERS.JWTService).to(JWTService).inSingletonScope();
        bind<IPasswordService>(IDENTIFIERS.PasswordService).to(PasswordService).inSingletonScope();
        bind<IMiddlewareFactory>(IDENTIFIERS.ValidationMiddleware)
            .to(ValidationMiddlewareFactory)
            .inSingletonScope();
        bind<IMiddleware>(IDENTIFIERS.AuthenticationMiddleware)
            .to(AuthenticationMiddleware)
            .inSingletonScope();
    });
}
