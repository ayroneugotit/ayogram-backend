import type { Context } from 'hono';
import { inject, injectable } from 'inversify';

import { AController } from '../../../core/controllers/abstract.controller.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IUsersService } from '../service/users.service.interface.js';
import { UserUpdateDTO } from '../users.dto.js';
import type { IUsersController } from './users.controller.interface.js';

@injectable()
export class UsersController extends AController implements IUsersController {
    public constructor(@inject(IDENTIFIERS.UsersService) private readonly service: IUsersService) {
        super('/users');
        super.addEndpoint({
            handler: this.update,
            path: '/:id',
            method: 'patch',
        });
        super.addEndpoint({
            handler: this.delete,
            path: '/:id',
            method: 'delete',
        });
    }

    public async update(c: Context): Promise<Response> {
        const id = c.req.param('id') as string;
        const { email, password } = (await c.req.json()) as UserUpdateDTO;

        const updatedUser = await this.service.update(id, email, password);
        return c.shape({
            message: 'user updated successfully',
            data: { user: updatedUser },
        });
    }

    public async delete(c: Context): Promise<Response> {
        const id = c.req.param('id') as string;

        const deletedUser = await this.service.delete(id);
        return c.shape({
            message: 'user deleted successfully',
            data: { user: deletedUser },
        });
    }
}
