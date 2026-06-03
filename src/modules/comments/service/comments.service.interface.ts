import type { Comment } from '../../../../prisma/generated/client.js';

export interface ICommentsService {
    create: (postId: string, userId: string, body: string) => Promise<Comment>;
    update: (id: string, body: string) => Promise<Comment>;
    delete: (id: string) => Promise<Comment>;
}
