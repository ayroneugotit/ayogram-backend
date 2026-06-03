import { inject, injectable } from 'inversify';

import type { Profile } from '../../../../prisma/generated/client.js';
import { HTTPError } from '../../../core/errors/http.error.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IProfilesRepository } from '../repository/profiles.repository.interface.js';
import type { IProfilesGuard } from './profiles.guard.interface.js';

@injectable()
export class ProfilesGuard implements IProfilesGuard {
    public constructor(
        @inject(IDENTIFIERS.ProfilesRepository) private readonly repository: IProfilesRepository,
    ) {}

    public async ensureProfileExists(id: string): Promise<Profile> {
        const profile = await this.repository.getById(id);
        if (!profile) {
            throw new HTTPError({
                message: 'profile not found',
                status: 404,
                source: this.constructor.name,
            });
        }
        return profile;
    }

    public async ensureUsernameIsNotUsed(username: string): Promise<void> {
        const profile = await this.repository.getByUsername(username);
        if (profile) {
            throw new HTTPError({
                message: 'profile with this username already exists',
                status: 409,
                source: this.constructor.name,
            });
        }
    }
}
