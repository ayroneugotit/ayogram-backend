import type { Comment } from '../../../../prisma/generated/client.js';

export interface ICommentsGuard {
    ensureCommentExists: (id: string) => Promise<Comment>;
}
