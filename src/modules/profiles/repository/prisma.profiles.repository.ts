import { inject, injectable } from 'inversify';

import type { Profile } from '../../../../prisma/generated/client.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import { APrismaRepository } from '../../../infrastructure/database/abstract.prisma.repository.js';
import type { PrismaDatabase } from '../../../infrastructure/database/prisma.database.js';
import type { IProfilesRepository } from './profiles.repository.interface.js';

@injectable()
export class PrismaProfilesRepository extends APrismaRepository implements IProfilesRepository {
    public constructor(@inject(IDENTIFIERS.PrismaDatabase) prismaDatabase: PrismaDatabase) {
        super(prismaDatabase);
    }

    public getById(id: string): Promise<Profile | null> {
        return this.database.profile.findUnique({ where: { id } });
    }

    public getByUsername(username: string): Promise<Profile | null> {
        return this.database.profile.findUnique({ where: { username } });
    }

    public update(id: string, username?: string, bio?: string): Promise<Profile> {
        return this.database.profile.update({ where: { id }, data: { username, bio } });
    }
}
