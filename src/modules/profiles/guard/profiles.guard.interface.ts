import type { Profile } from '../../../../prisma/generated/client.js';

export interface IProfilesGuard {
    ensureProfileExists: (id: string) => Promise<Profile>;
    ensureUsernameIsNotUsed: (username: string) => Promise<void>;
}
