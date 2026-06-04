import { injectable } from 'inversify';

import type { Comment } from '../../../../prisma/generated/client.js';
import type { ICommentsPolicy } from './comments.policy.interface.js';

@injectable()
export class CommentsPolicy implements ICommentsPolicy {
    private isOwner(currentUserId: string, { userId: targetCommentOwner }: Comment): boolean {
        return currentUserId === targetCommentOwner;
    }

    public canUpdate(currentUserId: string, targetComment: Comment): boolean {
        return this.isOwner(currentUserId, targetComment);
    }

    public canDelete(currentUserId: string, targetComment: Comment): boolean {
        return this.isOwner(currentUserId, targetComment);
    }
}
