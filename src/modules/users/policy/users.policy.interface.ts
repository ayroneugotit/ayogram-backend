import type { User } from '../../../../prisma/generated/client.js';

export interface IUsersPolicy {
    canUpdate: (currentUserId: string, targetUser: User) => boolean;
    canDelete: (currentUserId: string, targetUser: User) => boolean;
}
