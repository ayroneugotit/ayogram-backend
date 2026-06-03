import type { User } from '../../../../prisma/generated/client.js';

export interface IUsersService {
    update: (id: string, email?: string, password?: string) => Promise<User>;
    delete: (id: string) => Promise<User>;
}
