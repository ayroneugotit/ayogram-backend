import type { Profile } from '../../../../prisma/generated/client.js';

export interface IProfilesService {
    update: (id: string, username?: string, bio?: string) => Promise<Profile>;
}
