import type { Like } from '../../../../prisma/generated/client.js';

export interface ILikesGuard {
    ensureLikeExists: (postId: string, userId: string) => Promise<Like>;
    ensureLikeDoesNotExist: (postId: string, userId: string) => Promise<void>;
}
