import { configDotenv } from 'dotenv';

import { createAppContainer } from './container/container.js';
import type { IApp } from './core/app/app.interface.js';
import { AppError } from './core/errors/app.error.js';
import { IDENTIFIERS } from './core/identifiers.js';
import type { ILogger } from './core/loggers/logger.interface.js';
import type { PrismaDatabase } from './infrastructure/database/prisma.database.js';

async function bootstrap(): Promise<void> {
    configDotenv();

    const appContainer = createAppContainer();

    const logger = appContainer.get<ILogger>(IDENTIFIERS.Logger);

    try {
        const app = appContainer.get<IApp>(IDENTIFIERS.App);
        const prismaDatabase = appContainer.get<PrismaDatabase>(IDENTIFIERS.PrismaDatabase);
        await prismaDatabase.checkHealth();
        app.serve();
    } catch (e) {
        if (e instanceof AppError) {
            logger.fatal(e.source || '', e.message);
        }
        process.exit(1);
    }
}

await bootstrap();
