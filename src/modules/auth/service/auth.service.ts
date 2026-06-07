import { inject, injectable } from 'inversify';

import { HTTPError } from '../../../core/errors/http.error.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { ILogger } from '../../../core/loggers/logger.interface.js';
import type { IJWTService } from '../../../core/security/jwt/jwt.service.interface.js';
import type { IPasswordService } from '../../../core/security/password/password.service.interface.js';
import type { IProfilesRepository } from '../../profiles/repository/profiles.repository.interface.js';
import type { IUsersRepository } from '../../users/repository/users.repository.interface.js';
import type { IAuthService } from './auth.service.interface.js';

@injectable()
export class AuthService implements IAuthService {
    public constructor(
        @inject(IDENTIFIERS.Logger) private readonly logger: ILogger,
        @inject(IDENTIFIERS.JWTService) private readonly jwtService: IJWTService,
        @inject(IDENTIFIERS.PasswordService) private readonly passwordService: IPasswordService,
        @inject(IDENTIFIERS.UsersRepository) private readonly usersRepository: IUsersRepository,
        @inject(IDENTIFIERS.ProfilesRepository) private readonly profilesRepository: IProfilesRepository,
    ) {}

    public async register(email: string, username: string, password: string): Promise<string> {
        if (await this.usersRepository.getByEmail(email)) {
            throw new HTTPError({
                message: 'user with this email already exist',
                logMessage: `someone attempted to register with already used email '${email}'`,
                status: 409,
                source: this.constructor.name,
            });
        }
        if (await this.profilesRepository.getByUsername(username)) {
            throw new HTTPError({
                message: 'profile with this username already exists',
                logMessage: `someone attempted to register with already used username '${username}'`,
                status: 409,
                source: this.constructor.name,
            });
        }

        const hashedPassword = this.passwordService.hash(password);
        const { id } = await this.usersRepository.create(email, username, hashedPassword);

        this.logger.info(this.constructor.name, `user '${id}' registered successfully`);

        return this.jwtService.generateToken(id);
    }

    public async login(login: string, password: string): Promise<string> {
        const targetUser =
            (await this.usersRepository.getByEmail(login)) ??
            (await this.usersRepository.getByUsername(login));

        if (!targetUser) {
            throw new HTTPError({
                message: 'invalid credentials',
                logMessage: `someone attempted to login with not registered yet login '${login}'`,
                status: 401,
                source: this.constructor.name,
            });
        }

        if (!this.passwordService.verifyHashedPassword(password, targetUser.password)) {
            throw new HTTPError({
                message: 'invalid credentials',
                logMessage: `someone attempted to login as user '${targetUser.id}' with invalid password`,
                status: 401,
                source: this.constructor.name,
            });
        }

        this.logger.info(this.constructor.name, `user '${targetUser.id}' logged in successfully`);

        return this.jwtService.generateToken(targetUser.id);
    }
}
