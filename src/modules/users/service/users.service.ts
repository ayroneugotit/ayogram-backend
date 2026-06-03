import { inject, injectable } from 'inversify';

import type { User } from '../../../../prisma/generated/client.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IUsersGuard } from '../guard/users.guard.interface.js';
import type { IUsersRepository } from '../repository/users.repository.interface.js';
import type { IUsersService } from './users.service.interface.js';

@injectable()
export class UsersService implements IUsersService {
    public constructor(
        @inject(IDENTIFIERS.UsersRepository) private readonly repository: IUsersRepository,
        @inject(IDENTIFIERS.UsersGuard) private readonly guard: IUsersGuard,
    ) {}

    public async update(id: string, email?: string, password?: string): Promise<User> {
        await this.guard.ensureUserExists(id);
        if (email) await this.guard.ensureEmailIsNotUsed(email);

        return this.repository.update(id, email, password);
    }

    public async delete(id: string): Promise<User> {
        await this.guard.ensureUserExists(id);

        return this.repository.delete(id);
    }
}
