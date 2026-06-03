import type { User } from '../../../../prisma/generated/client.js';

export interface IUsersGuard {
    ensureUserExists: (id: string) => Promise<User>;
    ensureEmailIsNotUsed: (email: string) => Promise<void>;
}
