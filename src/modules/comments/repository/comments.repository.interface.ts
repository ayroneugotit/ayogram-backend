import type { Comment } from '../../../../prisma/generated/client.js';

export interface ICommentsRepository {
    create: (postId: string, userId: string, body: string) => Promise<Comment>;
    getById: (id: string) => Promise<Comment | null>;
    update: (id: string, body: string) => Promise<Comment>;
    delete: (id: string) => Promise<Comment>;
}
