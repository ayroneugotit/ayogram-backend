import type { Context } from 'hono';
import { inject, injectable } from 'inversify';

import { AController } from '../../../core/controllers/abstract.controller.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import { ProfileUpdateDTO } from '../profiles.dto.js';
import type { IProfilesService } from '../service/profiles.service.interface.js';
import type { IProfilesController } from './profiles.controller.interface.js';

@injectable()
export class ProfilesController extends AController implements IProfilesController {
    public constructor(@inject(IDENTIFIERS.ProfilesService) private readonly service: IProfilesService) {
        super('/profiles');
        super.addEndpoint({
            handler: this.update,
            path: '/:id',
            method: 'patch',
        });
    }

    public async update(c: Context): Promise<Response> {
        const id = c.req.param('id') as string;
        const { username, bio } = (await c.req.json()) as ProfileUpdateDTO;

        const updatedProfile = await this.service.update(id, username, bio);
        return c.shape({
            message: 'profile updated successfully',
            data: { profile: updatedProfile },
        });
    }
}
