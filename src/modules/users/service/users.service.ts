import { inject, injectable } from 'inversify';

import type { User } from '../../../../prisma/generated/client.js';
import { HTTPError } from '../../../core/errors/http.error.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { ILogger } from '../../../core/loggers/logger.interface.js';
import type { IPasswordService } from '../../../core/security/password/password.service.interface.js';
import type { IUsersPolicy } from '../policy/users.policy.interface.js';
import type { IUsersRepository } from '../repository/users.repository.interface.js';
import type { IUsersService } from './users.service.interface.js';

@injectable()
export class UsersService implements IUsersService {
    public constructor(
        @inject(IDENTIFIERS.Logger) private readonly logger: ILogger,
        @inject(IDENTIFIERS.PasswordService) private readonly passwordService: IPasswordService,
        @inject(IDENTIFIERS.UsersRepository) private readonly repository: IUsersRepository,
        @inject(IDENTIFIERS.UsersPolicy) private readonly policy: IUsersPolicy,
    ) {}

    public async update({
        currentUserId,
        targetUserId,
        email,
        password,
    }: {
        currentUserId: string;
        targetUserId: string;
        email?: string;
        password?: string;
    }): Promise<User> {
        const targetUser = await this.repository.getById(targetUserId);

        if (!targetUser) {
            throw new HTTPError({
                message: 'user not found',
                logMessage: `user '${currentUserId}' attempted to update not existing yet user '${targetUserId}'`,
                status: 404,
                source: this.constructor.name,
            });
        }
        if (email && (await this.repository.getByEmail(email))) {
            throw new HTTPError({
                message: 'user with this email already exist',
                logMessage: `user '${currentUserId}' attempted to use already used email '${email}'`,
                status: 409,
                source: this.constructor.name,
            });
        }
        if (!this.policy.canUpdate(currentUserId, targetUser)) {
            throw new HTTPError({
                message: 'forbidden',
                logMessage: `user '${currentUserId} attempted to update user '${targetUserId}' without needed rights`,
                status: 403,
                source: this.constructor.name,
            });
        }

        let updatedUser;

        if (password) {
            const hashedPassword = this.passwordService.hash(password);
            updatedUser = await this.repository.update(targetUserId, email, hashedPassword);
        } else {
            updatedUser = await this.repository.update(targetUserId, email);
        }

        this.logger.info(
            this.constructor.name,
            `user '${currentUserId}' successfully updated user '${updatedUser.id}'`,
        );

        return this.repository.update(targetUserId, email);
    }

    public async delete({
        currentUserId,
        targetUserId,
    }: {
        currentUserId: string;
        targetUserId: string;
    }): Promise<User> {
        const targetUser = await this.repository.getById(targetUserId);

        if (!targetUser) {
            throw new HTTPError({
                message: 'user not found',
                logMessage: `user '${currentUserId}' attempted to delete not existing yet user '${targetUserId}'`,
                status: 404,
                source: this.constructor.name,
            });
        }
        if (!this.policy.canDelete(currentUserId, targetUser)) {
            throw new HTTPError({
                message: 'forbidden',
                logMessage: `user '${currentUserId} attempted to delete user '${targetUserId}' without needed rights`,
                status: 403,
                source: this.constructor.name,
            });
        }

        const deletedUser = await this.repository.delete(targetUserId);

        this.logger.info(
            this.constructor.name,
            `user '${currentUserId}' successfully deleted user ${deletedUser.id}`,
        );

        return deletedUser;
    }
}
