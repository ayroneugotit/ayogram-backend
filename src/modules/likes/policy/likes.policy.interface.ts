import type { Like } from '../../../../prisma/generated/client.js';

export interface ILikesPolicy {
    canDelete: (currentUserId: string, targetLike: Like) => boolean;
}
