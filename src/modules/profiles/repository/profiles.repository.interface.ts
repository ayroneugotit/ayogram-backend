import type { Profile } from '../../../../prisma/generated/client.js';

export interface IProfilesRepository {
    getById: (id: string) => Promise<Profile | null>;
    getByUsername: (username: string) => Promise<Profile | null>;
    update: (id: string, username?: string, bio?: string) => Promise<Profile>;
}
