import { PrismaPg } from '@prisma/adapter-pg';
import { inject, injectable } from 'inversify';

import { PrismaClient } from '../../../prisma/generated/client.js';
import type { IAppConfig } from '../../core/app/app.config.interface.js';
import { AppError } from '../../core/errors/app.error.js';
import { IDENTIFIERS } from '../../core/identifiers.js';

@injectable()
export class PrismaDatabase {
    public readonly instance: PrismaClient;

    public constructor(@inject(IDENTIFIERS.AppConfig) config: IAppConfig) {
        const adapter = new PrismaPg({ connectionString: config.databaseUrl });
        this.instance = new PrismaClient({ adapter });
    }

    public async checkHealth(): Promise<void> {
        try {
            await this.instance.$queryRaw`SELECT 1`;
        } catch {
            throw new AppError({ message: 'failed to connect to database', source: this.constructor.name });
        }
    }
}
