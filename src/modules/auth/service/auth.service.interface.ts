import type { User } from '../../../../prisma/generated/client.js';

export interface IAuthService {
    register: (email: string, username: string, password: string) => Promise<User>;
    login: (login: string, password: string) => Promise<User>;
}
