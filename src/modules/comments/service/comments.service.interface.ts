import type { Comment } from '../../../../prisma/generated/client.js';

export interface ICommentsService {
    create: (options: { currentUserId: string; targetPostId: string; body: string }) => Promise<Comment>;
    update: (options: { currentUserId: string; targetCommentId: string; body: string }) => Promise<Comment>;
    delete: (options: { currentUserId: string; targetCommentId: string }) => Promise<Comment>;
}
