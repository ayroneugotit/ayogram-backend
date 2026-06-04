import { inject, injectable } from 'inversify';

import { HTTPError } from '../../../core/errors/http.error.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IJWTService } from '../../../core/security/jwt/jwt.service.interface.js';
import type { IPasswordService } from '../../../core/security/password/password.service.interface.js';
import type { IProfilesGuard } from '../../profiles/guard/profiles.guard.interface.js';
import type { IUsersGuard } from '../../users/guard/users.guard.interface.js';
import type { IUsersRepository } from '../../users/repository/users.repository.interface.js';
import type { IAuthService } from './auth.service.interface.js';

@injectable()
export class AuthService implements IAuthService {
    public constructor(
        @inject(IDENTIFIERS.JWTService) private readonly jwtService: IJWTService,
        @inject(IDENTIFIERS.PasswordService) private readonly passwordService: IPasswordService,
        @inject(IDENTIFIERS.UsersRepository) private readonly repository: IUsersRepository,
        @inject(IDENTIFIERS.UsersGuard) private readonly usersGuard: IUsersGuard,
        @inject(IDENTIFIERS.ProfilesGuard) private readonly profilesGuard: IProfilesGuard,
    ) {}

    public async register(email: string, username: string, password: string): Promise<string> {
        await this.usersGuard.ensureEmailIsNotUsed(email);
        await this.profilesGuard.ensureUsernameIsNotUsed(username);

        const hashedPassword = this.passwordService.hash(password);
        const { id } = await this.repository.create(email, username, hashedPassword);
        return this.jwtService.generateToken(id);
    }

    public async login(login: string, password: string): Promise<string> {
        const user =
            (await this.repository.getByEmail(login)) ?? (await this.repository.getByUsername(login));
        if (!user || !this.passwordService.verifyHashedPassword(password, user.password)) {
            throw new HTTPError({
                message: 'invalid credentials',
                status: 401,
                source: this.constructor.name,
            });
        }

        return this.jwtService.generateToken(user.id);
    }
}
