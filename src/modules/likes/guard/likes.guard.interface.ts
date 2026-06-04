import type { Like } from '../../../../prisma/generated/client.js';

export interface ILikesGuard {
    ensureLikeExists: (userId: string, postId: string) => Promise<Like>;
    ensureLikeDoesNotExist: (userId: string, postId: string) => Promise<void>;
}
