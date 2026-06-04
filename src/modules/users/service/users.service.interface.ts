import type { User } from '../../../../prisma/generated/client.js';

export interface IUsersService {
    update: (options: {
        currentUserId: string;
        targetUserId: string;
        email?: string;
        password?: string;
    }) => Promise<User>;

    delete: (options: { currentUserId: string; targetUserId: string }) => Promise<User>;
}
