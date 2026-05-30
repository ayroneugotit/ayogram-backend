import { configDotenv } from 'dotenv';

import { createAppContainer } from './container.js';
import type { IApp } from './core/app/app.interface.js';
import { IDENTIFIERS } from './core/identifiers.js';

function bootstrap(): void {
    configDotenv();

    const appContainer = createAppContainer();
    const app = appContainer.get<IApp>(IDENTIFIERS.App);

    try {
        app.serve();
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

bootstrap();
