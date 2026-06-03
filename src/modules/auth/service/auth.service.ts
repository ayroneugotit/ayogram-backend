import { inject, injectable } from 'inversify';

import type { User } from '../../../../prisma/generated/client.js';
import { HTTPError } from '../../../core/errors/http.error.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IProfilesGuard } from '../../profiles/guard/profiles.guard.interface.js';
import type { IUsersGuard } from '../../users/guard/users.guard.interface.js';
import type { IUsersRepository } from '../../users/repository/users.repository.interface.js';
import type { IAuthService } from './auth.service.interface.js';

@injectable()
export class AuthService implements IAuthService {
    public constructor(
        @inject(IDENTIFIERS.UsersRepository) private readonly repository: IUsersRepository,
        @inject(IDENTIFIERS.UsersGuard) private readonly usersGuard: IUsersGuard,
        @inject(IDENTIFIERS.ProfilesGuard) private readonly profilesGuard: IProfilesGuard,
    ) {}

    public async register(email: string, username: string, password: string): Promise<User> {
        await this.usersGuard.ensureEmailIsNotUsed(email);
        await this.profilesGuard.ensureUsernameIsNotUsed(username);

        return this.repository.create(email, username, password);
    }

    public async login(login: string, password: string): Promise<User> {
        const targetUser =
            (await this.repository.getByEmail(login)) ?? (await this.repository.getByUsername(login));
        if (!targetUser || targetUser.password !== password) {
            throw new HTTPError({
                message: 'invalid credentials',
                status: 401,
                source: this.constructor.name,
            });
        }

        return targetUser;
    }
}
