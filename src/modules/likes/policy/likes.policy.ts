import { injectable } from 'inversify';

import type { Like } from '../../../../prisma/generated/client.js';
import type { ILikesPolicy } from './likes.policy.interface.js';

@injectable()
export class LikesPolicy implements ILikesPolicy {
    private isOwner(currentUserId: string, { userId: targetLikeOwnerId }: Like): boolean {
        return currentUserId === targetLikeOwnerId;
    }

    public canDelete(currentUserId: string, targetLike: Like): boolean {
        return this.isOwner(currentUserId, targetLike);
    }
}
