import type { User } from '../../../../prisma/generated/client.js';

export interface IUsersRepository {
    create: (email: string, username: string, password: string) => Promise<User>;
    getById: (id: string) => Promise<User | null>;
    getByEmail: (email: string) => Promise<User | null>;
    getByUsername: (username: string) => Promise<User | null>;
    update: (id: string, email?: string, password?: string) => Promise<User>;
    delete: (id: string) => Promise<User>;
}
