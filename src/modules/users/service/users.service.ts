import { inject, injectable } from 'inversify';

import type { User } from '../../../../prisma/generated/client.js';
import { HTTPError } from '../../../core/errors/http.error.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IPasswordService } from '../../../core/security/password/password.service.interface.js';
import type { IUsersGuard } from '../guard/users.guard.interface.js';
import type { IUsersPolicy } from '../policy/users.policy.interface.js';
import type { IUsersRepository } from '../repository/users.repository.interface.js';
import type { IUsersService } from './users.service.interface.js';

@injectable()
export class UsersService implements IUsersService {
    public constructor(
        @inject(IDENTIFIERS.PasswordService) private readonly passwordService: IPasswordService,
        @inject(IDENTIFIERS.UsersRepository) private readonly repository: IUsersRepository,
        @inject(IDENTIFIERS.UsersGuard) private readonly guard: IUsersGuard,
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
        const targetUser = await this.guard.ensureUserExists(targetUserId);
        if (email) await this.guard.ensureEmailIsNotUsed(email);

        if (!this.policy.canUpdate(currentUserId, targetUser)) {
            throw new HTTPError({
                message: 'forbidden',
                status: 403,
                source: this.constructor.name,
            });
        }

        if (password) {
            const hashedPassword = this.passwordService.hash(password);
            return this.repository.update(targetUserId, email, hashedPassword);
        }
        return this.repository.update(targetUserId, email);
    }

    public async delete({
        currentUserId,
        targetUserId,
    }: {
        currentUserId: string;
        targetUserId: string;
    }): Promise<User> {
        const targetUser = await this.guard.ensureUserExists(targetUserId);

        if (!this.policy.canDelete(currentUserId, targetUser)) {
            throw new HTTPError({
                message: 'forbidden',
                status: 403,
                source: this.constructor.name,
            });
        }

        return this.repository.delete(targetUserId);
    }
}
