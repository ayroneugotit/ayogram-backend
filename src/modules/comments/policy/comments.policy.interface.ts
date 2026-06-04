import type { Comment } from '../../../../prisma/generated/client.js';

export interface ICommentsPolicy {
    canUpdate: (currentUserId: string, targetComment: Comment) => boolean;
    canDelete: (currentUserId: string, targetComment: Comment) => boolean;
}
