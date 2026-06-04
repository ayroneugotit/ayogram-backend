import { injectable } from 'inversify';

import type { IAppConfig } from './app.config.interface.js';

@injectable()
export class AppConfig implements IAppConfig {
    public readonly basePath: string;
    public readonly port: number;
    public readonly databaseUrl: string;
    public readonly secret: string;
    public readonly rounds: number;

    public constructor() {
        this.basePath = process.env.BASE_PATH || '';
        this.port = Number(process.env.PORT) || 3000;
        this.databaseUrl = process.env.DATABASE_URL || '';
        this.secret = process.env.SECRET || 'secret';
        this.rounds = Number(process.env.SECRET) || 5;
    }
}
