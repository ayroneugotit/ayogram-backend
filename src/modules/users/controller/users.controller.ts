import type { Context } from 'hono';
import { inject, injectable } from 'inversify';

import { AController } from '../../../core/controllers/abstract.controller.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IMiddlewareFactory } from '../../../core/middlewares/middleware.factory.interface.js';
import type { IMiddleware } from '../../../core/middlewares/middleware.interface.js';
import type { IUsersService } from '../service/users.service.interface.js';
import { UserUpdateDTO } from '../users.dto.js';
import type { IUsersController } from './users.controller.interface.js';

@injectable()
export class UsersController extends AController implements IUsersController {
    public constructor(
        @inject(IDENTIFIERS.UsersService) private readonly service: IUsersService,
        @inject(IDENTIFIERS.AuthenticationMiddleware) authenticationMiddleware: IMiddleware,
        @inject(IDENTIFIERS.ValidationMiddleware) validationMiddleware: IMiddlewareFactory,
    ) {
        super('/users');
        super.addEndpoint({
            handler: this.update,
            middlewares: [authenticationMiddleware, validationMiddleware.create(UserUpdateDTO)],
            path: '/:id',
            method: 'patch',
        });
        super.addEndpoint({
            handler: this.delete,
            middlewares: [authenticationMiddleware],
            path: '/:id',
            method: 'delete',
        });
    }

    public async update(c: Context): Promise<Response> {
        const targetUserId = c.req.param('id') as string;
        const { userId: currentUserId } = c.get('payload');

        const { email, password } = (await c.req.json()) as UserUpdateDTO;

        const updatedUser = await this.service.update({
            currentUserId,
            targetUserId,
            email,
            password,
        });

        return c.shape({
            message: 'user updated successfully',
            data: { user: updatedUser },
        });
    }

    public async delete(c: Context): Promise<Response> {
        const targetUserId = c.req.param('id') as string;
        const { userId: currentUserId } = c.get('payload');

        const deletedUser = await this.service.delete({
            currentUserId,
            targetUserId,
        });

        return c.shape({
            message: 'user deleted successfully',
            data: { user: deletedUser },
        });
    }
}
