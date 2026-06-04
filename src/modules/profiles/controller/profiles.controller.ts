import type { Context } from 'hono';
import { inject, injectable } from 'inversify';

import { AController } from '../../../core/controllers/abstract.controller.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IMiddlewareFactory } from '../../../core/middlewares/middleware.factory.interface.js';
import type { IMiddleware } from '../../../core/middlewares/middleware.interface.js';
import { ProfileUpdateDTO } from '../profiles.dto.js';
import type { IProfilesService } from '../service/profiles.service.interface.js';
import type { IProfilesController } from './profiles.controller.interface.js';

@injectable()
export class ProfilesController extends AController implements IProfilesController {
    public constructor(
        @inject(IDENTIFIERS.ProfilesService) private readonly service: IProfilesService,
        @inject(IDENTIFIERS.AuthenticationMiddleware) authenticationMiddleware: IMiddleware,
        @inject(IDENTIFIERS.ValidationMiddleware) validationMiddleware: IMiddlewareFactory,
    ) {
        super('/profiles');
        super.addEndpoint({
            handler: this.update,
            middlewares: [authenticationMiddleware, validationMiddleware.create(ProfileUpdateDTO)],
            path: '/:id',
            method: 'patch',
        });
    }

    public async update(c: Context): Promise<Response> {
        const targetProfileId = c.req.param('id') as string;
        const { userId: currentUserId } = c.get('payload');

        const { username, bio } = (await c.req.json()) as ProfileUpdateDTO;

        const updatedProfile = await this.service.update({
            currentUserId,
            targetProfileId,
            username,
            bio,
        });

        return c.shape({
            message: 'profile updated successfully',
            data: { profile: updatedProfile },
        });
    }
}
