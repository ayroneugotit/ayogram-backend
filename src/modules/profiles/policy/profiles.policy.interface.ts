import type { Profile } from '../../../../prisma/generated/client.js';

export interface IProfilesPolicy {
    canUpdate: (currentUserId: string, targetProfile: Profile) => boolean;
}
