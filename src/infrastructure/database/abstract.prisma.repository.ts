import { inject, injectable } from 'inversify';

import type { PrismaClient } from '../../../prisma/generated/client.js';
import { IDENTIFIERS } from '../../core/identifiers.js';
import type { PrismaDatabase } from './prisma.database.js';

@injectable()
export abstract class APrismaRepository {
    protected readonly database: PrismaClient;

    public constructor(@inject(IDENTIFIERS.PrismaDatabase) prismaDatabase: PrismaDatabase) {
        this.database = prismaDatabase.instance;
    }
}
