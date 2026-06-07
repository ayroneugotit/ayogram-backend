import { inject, injectable } from 'inversify';

import type { Profile } from '../../../../prisma/generated/client.js';
import { HTTPError } from '../../../core/errors/http.error.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { ILogger } from '../../../core/loggers/logger.interface.js';
import type { IProfilesPolicy } from '../policy/profiles.policy.interface.js';
import type { IProfilesRepository } from '../repository/profiles.repository.interface.js';
import type { IProfilesService } from './profiles.service.interface.js';

@injectable()
export class ProfilesService implements IProfilesService {
    public constructor(
        @inject(IDENTIFIERS.Logger) private readonly logger: ILogger,
        @inject(IDENTIFIERS.ProfilesRepository) private readonly repository: IProfilesRepository,
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
        const targetProfile = await this.repository.getById(targetProfileId);

        if (!targetProfile) {
            throw new HTTPError({
                message: 'profile not found',
                logMessage: `user '${currentUserId} attempted to update not existing yet profile '${targetProfileId}'`,
                status: 404,
                source: this.constructor.name,
            });
        }
        if (username && (await this.repository.getByUsername(username))) {
            throw new HTTPError({
                message: 'profile with this username already exists',
                logMessage: `user '${currentUserId} attempted to use already used username '${username}'`,
                status: 409,
                source: this.constructor.name,
            });
        }
        if (!this.policy.canUpdate(currentUserId, targetProfile)) {
            throw new HTTPError({
                message: 'forbidden',
                logMessage: `user '${currentUserId} attempted to update profile '${targetProfileId}' without needed rights`,
                status: 403,
                source: this.constructor.name,
            });
        }

        const updatedUser = await this.repository.update(targetProfileId, username, bio);

        this.logger.info(
            this.constructor.name,
            `user '${currentUserId}' successfully updated profile '${targetProfileId}'`,
        );

        return updatedUser;
    }
}
