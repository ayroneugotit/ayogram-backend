import type { Post } from '../../../../prisma/generated/client.js';

export interface IPostsPolicy {
    canUpdate: (currentUserId: string, targetPost: Post) => boolean;
    canDelete: (currentUserId: string, targetPost: Post) => boolean;
}
