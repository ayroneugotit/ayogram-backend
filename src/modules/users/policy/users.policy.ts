import { injectable } from 'inversify';

import type { User } from '../../../../prisma/generated/client.js';
import type { IUsersPolicy } from './users.policy.interface.js';

@injectable()
export class UsersPolicy implements IUsersPolicy {
    private isOwner(currentUserId: string, { id: targetUserId }: User): boolean {
        return currentUserId === targetUserId;
    }

    public canUpdate(currentUserId: string, targetUser: User): boolean {
        return this.isOwner(currentUserId, targetUser);
    }

    public canDelete(currentUserId: string, targetUser: User): boolean {
        return this.isOwner(currentUserId, targetUser);
    }
}
