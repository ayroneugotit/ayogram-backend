import { injectable } from 'inversify';

import type { Profile } from '../../../../prisma/generated/client.js';
import type { IProfilesPolicy } from './profiles.policy.interface.js';

@injectable()
export class ProfilesPolicy implements IProfilesPolicy {
    private isOwner(currentUserId: string, { userId: targetProfileOwnerId }: Profile): boolean {
        return currentUserId === targetProfileOwnerId;
    }

    public canUpdate(currentUserId: string, targetProfile: Profile): boolean {
        return this.isOwner(currentUserId, targetProfile);
    }
}
