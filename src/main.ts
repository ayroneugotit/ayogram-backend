import { configDotenv } from 'dotenv';

import { createAppContainer } from './container/container.js';
import type { IApp } from './core/app/app.interface.js';
import { IDENTIFIERS } from './core/identifiers.js';
import type { PrismaDatabase } from './infrastructure/database/prisma.database.js';

async function bootstrap(): Promise<void> {
    configDotenv();

    const appContainer = createAppContainer();

    const prismaDatabase = appContainer.get<PrismaDatabase>(IDENTIFIERS.PrismaDatabase);
    const app = appContainer.get<IApp>(IDENTIFIERS.App);

    try {
        await prismaDatabase.checkHealth();
        app.serve();
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

await bootstrap();
