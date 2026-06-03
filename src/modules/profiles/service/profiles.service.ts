import { inject, injectable } from 'inversify';

import type { Profile } from '../../../../prisma/generated/client.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IProfilesGuard } from '../guard/profiles.guard.interface.js';
import type { IProfilesRepository } from '../repository/profiles.repository.interface.js';
import type { IProfilesService } from './profiles.service.interface.js';

@injectable()
export class ProfilesService implements IProfilesService {
    public constructor(
        @inject(IDENTIFIERS.ProfilesRepository) private readonly repository: IProfilesRepository,
        @inject(IDENTIFIERS.ProfilesGuard) private readonly guard: IProfilesGuard,
    ) {}

    public async update(id: string, username?: string, bio?: string): Promise<Profile> {
        await this.guard.ensureProfileExists(id);
        if (username) await this.guard.ensureUsernameIsNotUsed(username);

        return this.repository.update(id, username, bio);
    }
}
