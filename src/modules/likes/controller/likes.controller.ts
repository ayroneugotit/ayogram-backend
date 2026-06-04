import type { Context } from 'hono';
import { inject, injectable } from 'inversify';

import { AController } from '../../../core/controllers/abstract.controller.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IMiddlewareFactory } from '../../../core/middlewares/middleware.factory.interface.js';
import type { IMiddleware } from '../../../core/middlewares/middleware.interface.js';
import { LikeCreateDTO, LikeDeleteDTO } from '../likes.dto.js';
import type { ILikesService } from '../service/likes.service.interface.js';
import type { ILikesController } from './likes.controller.interface.js';

@injectable()
export class LikesController extends AController implements ILikesController {
    public constructor(
        @inject(IDENTIFIERS.LikesService) private readonly service: ILikesService,
        @inject(IDENTIFIERS.AuthenticationMiddleware) authenticationMiddleware: IMiddleware,
        @inject(IDENTIFIERS.ValidationMiddleware) validationMiddleware: IMiddlewareFactory,
    ) {
        super('/likes');
        super.addEndpoint({
            handler: this.create,
            middlewares: [authenticationMiddleware, validationMiddleware.create(LikeCreateDTO)],
            method: 'post',
        });
        super.addEndpoint({
            handler: this.delete,
            middlewares: [authenticationMiddleware, validationMiddleware.create(LikeDeleteDTO)],
            method: 'delete',
        });
    }

    public async create(c: Context): Promise<Response> {
        const { userId: currentUserId } = c.get('payload');

        const { postId: targetPostId } = (await c.req.json()) as LikeCreateDTO;

        const createdLike = await this.service.create({ currentUserId, targetPostId });

        return c.shape({
            message: 'like created successfully',
            data: { like: createdLike },
            status: 201,
        });
    }

    public async delete(c: Context): Promise<Response> {
        const { userId: currentUserId } = c.get('payload');

        const { postId: targetPostId } = (await c.req.json()) as LikeDeleteDTO;

        const deletedLike = await this.service.delete({ currentUserId, targetPostId });

        return c.shape({
            message: 'like deleted successfully',
            data: { like: deletedLike },
        });
    }
}
