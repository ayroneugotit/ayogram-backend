import type { Profile } from '../../../../prisma/generated/client.js';

export interface IProfilesService {
    update: (options: {
        currentUserId: string;
        targetProfileId: string;
        username?: string;
        bio?: string;
    }) => Promise<Profile>;
}
