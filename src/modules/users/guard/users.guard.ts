import { inject, injectable } from 'inversify';

import type { User } from '../../../../prisma/generated/client.js';
import { HTTPError } from '../../../core/errors/http.error.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IUsersRepository } from '../repository/users.repository.interface.js';
import type { IUsersGuard } from './users.guard.interface.js';

@injectable()
export class UsersGuard implements IUsersGuard {
    public constructor(@inject(IDENTIFIERS.UsersRepository) private readonly repository: IUsersRepository) {}

    public async ensureUserExists(id: string): Promise<User> {
        const user = await this.repository.getById(id);
        if (!user) {
            throw new HTTPError({
                message: 'user not found',
                status: 404,
                source: this.constructor.name,
            });
        }
        return user;
    }

    public async ensureEmailIsNotUsed(email: string): Promise<void> {
        const user = await this.repository.getByEmail(email);
        if (user) {
            throw new HTTPError({
                message: 'user with this email already exist',
                status: 409,
                source: this.constructor.name,
            });
        }
    }
}
