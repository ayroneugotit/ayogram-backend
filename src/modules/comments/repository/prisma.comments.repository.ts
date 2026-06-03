import { inject, injectable } from 'inversify';

import type { Comment } from '../../../../prisma/generated/client.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import { APrismaRepository } from '../../../infrastructure/database/abstract.prisma.repository.js';
import type { PrismaDatabase } from '../../../infrastructure/database/prisma.database.js';
import type { ICommentsRepository } from './comments.repository.interface.js';

@injectable()
export class PrismaCommentsRepository extends APrismaRepository implements ICommentsRepository {
    public constructor(@inject(IDENTIFIERS.PrismaDatabase) prismaDatabase: PrismaDatabase) {
        super(prismaDatabase);
    }

    public create(postId: string, userId: string, body: string): Promise<Comment> {
        return this.database.comment.create({ data: { postId, userId, body } });
    }

    public getById(id: string): Promise<Comment | null> {
        return this.database.comment.findUnique({ where: { id } });
    }

    public update(id: string, body: string): Promise<Comment> {
        return this.database.comment.update({ where: { id }, data: { body } });
    }

    public delete(id: string): Promise<Comment> {
        return this.database.comment.delete({ where: { id } });
    }
}
