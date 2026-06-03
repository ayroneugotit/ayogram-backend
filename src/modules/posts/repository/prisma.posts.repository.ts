import { inject, injectable } from 'inversify';

import type { Post } from '../../../../prisma/generated/client.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import { APrismaRepository } from '../../../infrastructure/database/abstract.prisma.repository.js';
import type { PrismaDatabase } from '../../../infrastructure/database/prisma.database.js';
import type { IPostsRepository } from './posts.repository.interface.js';

@injectable()
export class PrismaPostsRepository extends APrismaRepository implements IPostsRepository {
    public constructor(@inject(IDENTIFIERS.PrismaDatabase) prismaDatabase: PrismaDatabase) {
        super(prismaDatabase);
    }

    public create(userId: string, title: string, body: string): Promise<Post> {
        return this.database.post.create({ data: { title, body, userId } });
    }

    public getById(id: string): Promise<Post | null> {
        return this.database.post.findUnique({ where: { id } });
    }

    public update(id: string, title?: string, body?: string): Promise<Post> {
        return this.database.post.update({ where: { id }, data: { title, body } });
    }

    public delete(id: string): Promise<Post> {
        return this.database.post.delete({ where: { id } });
    }
}
