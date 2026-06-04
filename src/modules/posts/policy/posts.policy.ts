import { injectable } from 'inversify';

import type { Post } from '../../../../prisma/generated/client.js';
import type { IPostsPolicy } from './posts.policy.interface.js';

@injectable()
export class PostsPolicy implements IPostsPolicy {
    private isOwner(currentUserId: string, { userId: targetPostOwnerId }: Post): boolean {
        return currentUserId === targetPostOwnerId;
    }

    public canUpdate(currentUserId: string, targetPost: Post): boolean {
        return this.isOwner(currentUserId, targetPost);
    }

    public canDelete(currentUserId: string, targetPost: Post): boolean {
        return this.isOwner(currentUserId, targetPost);
    }
}
