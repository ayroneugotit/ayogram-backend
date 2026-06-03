import { inject, injectable } from 'inversify';

import type { User } from '../../../../prisma/generated/client.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import { APrismaRepository } from '../../../infrastructure/database/abstract.prisma.repository.js';
import type { PrismaDatabase } from '../../../infrastructure/database/prisma.database.js';
import type { IUsersRepository } from './users.repository.interface.js';

@injectable()
export class PrismaUsersRepository extends APrismaRepository implements IUsersRepository {
    public constructor(@inject(IDENTIFIERS.PrismaDatabase) prismaDatabase: PrismaDatabase) {
        super(prismaDatabase);
    }

    public create(email: string, username: string, password: string): Promise<User> {
        return this.database.user.create({ data: { email, password, profile: { create: { username } } } });
    }

    public getById(id: string): Promise<User | null> {
        return this.database.user.findUnique({ where: { id } });
    }

    public getByEmail(email: string): Promise<User | null> {
        return this.database.user.findUnique({ where: { email } });
    }

    public getByUsername(username: string): Promise<User | null> {
        return this.database.user.findFirst({ where: { profile: { username } } });
    }

    public update(id: string, email?: string, password?: string): Promise<User> {
        return this.database.user.update({ where: { id }, data: { email, password } });
    }

    public delete(id: string): Promise<User> {
        return this.database.user.delete({ where: { id } });
    }
}
