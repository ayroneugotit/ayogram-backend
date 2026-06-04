import { inject, injectable } from 'inversify';

import type { Profile } from '../../../../prisma/generated/client.js';
import { HTTPError } from '../../../core/errors/http.error.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IProfilesGuard } from '../guard/profiles.guard.interface.js';
import type { IProfilesPolicy } from '../policy/profiles.policy.interface.js';
import type { IProfilesRepository } from '../repository/profiles.repository.interface.js';
import type { IProfilesService } from './profiles.service.interface.js';

@injectable()
export class ProfilesService implements IProfilesService {
    public constructor(
        @inject(IDENTIFIERS.ProfilesRepository) private readonly repository: IProfilesRepository,
        @inject(IDENTIFIERS.ProfilesGuard) private readonly guard: IProfilesGuard,
        @inject(IDENTIFIERS.ProfilesPolicy) private readonly policy: IProfilesPolicy,
    ) {}

    public async update({
        currentUserId,
        targetProfileId,
        username,
        bio,
    }: {
        currentUserId: string;
        targetProfileId: string;
        username?: string;
        bio?: string;
    }): Promise<Profile> {
        const targetProfile = await this.guard.ensureProfileExists(targetProfileId);
        if (username) await this.guard.ensureUsernameIsNotUsed(username);

        if (!this.policy.canUpdate(currentUserId, targetProfile)) {
            throw new HTTPError({
                message: 'forbidden',
                status: 403,
                source: this.constructor.name,
            });
        }

        return this.repository.update(targetProfileId, username, bio);
    }
}
