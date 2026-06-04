import { inject, injectable } from 'inversify';

import type { Like } from '../../../../prisma/generated/client.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import { APrismaRepository } from '../../../infrastructure/database/abstract.prisma.repository.js';
import type { PrismaDatabase } from '../../../infrastructure/database/prisma.database.js';
import type { ILikesRepository } from './likes.repository.interface.js';

@injectable()
export class PrismaLikesRepository extends APrismaRepository implements ILikesRepository {
    public constructor(@inject(IDENTIFIERS.PrismaDatabase) prismaDatabase: PrismaDatabase) {
        super(prismaDatabase);
    }

    public create(userId: string, postId: string): Promise<Like> {
        return this.database.like.create({ data: { postId, userId } });
    }

    public getByPostAndUserIds(userId: string, postId: string): Promise<Like | null> {
        return this.database.like.findUnique({ where: { postId_userId: { postId, userId } } });
    }

    public delete(userId: string, postId: string): Promise<Like> {
        return this.database.like.delete({ where: { postId_userId: { postId, userId } } });
    }
}
