import { injectable } from 'inversify';

import type { IAppConfig } from './app.config.interface.js';

@injectable()
export class AppConfig implements IAppConfig {
    public readonly basePath: string;
    public readonly port: number;
    public readonly databaseUrl: string;

    public constructor() {
        this.basePath = process.env.BASE_PATH || '';
        this.port = Number(process.env.PORT) || 3000;
        this.databaseUrl = process.env.DATABASE_URL || '';
    }
}
