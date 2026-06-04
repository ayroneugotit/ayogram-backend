import type { Context } from 'hono';
import { inject, injectable } from 'inversify';

import { AController } from '../../../core/controllers/abstract.controller.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IMiddlewareFactory } from '../../../core/middlewares/middleware.factory.interface.js';
import type { IMiddleware } from '../../../core/middlewares/middleware.interface.js';
import { PostCreateDTO, PostUpdateDTO } from '../posts.dto.js';
import type { IPostsService } from '../service/posts.service.interface.js';
import type { IPostsController } from './posts.controller.interface.js';

@injectable()
export class PostsController extends AController implements IPostsController {
    public constructor(
        @inject(IDENTIFIERS.PostsService) private readonly service: IPostsService,
        @inject(IDENTIFIERS.AuthenticationMiddleware) authenticationMiddleware: IMiddleware,
        @inject(IDENTIFIERS.ValidationMiddleware) validationMiddleware: IMiddlewareFactory,
    ) {
        super('/posts');
        super.addEndpoint({
            handler: this.create,
            middlewares: [authenticationMiddleware, validationMiddleware.create(PostCreateDTO)],
            method: 'post',
        });
        super.addEndpoint({
            handler: this.update,
            middlewares: [authenticationMiddleware, validationMiddleware.create(PostUpdateDTO)],
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

    public async create(c: Context): Promise<Response> {
        const { userId: currentUserId } = c.get('payload');

        const { title, body } = (await c.req.json()) as PostCreateDTO;

        const createdPost = await this.service.create({
            currentUserId,
            title,
            body,
        });

        return c.shape({
            message: 'post created successfully',
            data: { post: createdPost },
            status: 201,
        });
    }

    public async update(c: Context): Promise<Response> {
        const targetPostId = c.req.param('id') as string;
        const { userId: currentUserId } = c.get('payload');

        const { title, body } = (await c.req.json()) as PostUpdateDTO;

        const updatedPost = await this.service.update({
            currentUserId,
            targetPostId,
            title,
            body,
        });

        return c.shape({
            message: 'post updated successfully',
            data: { post: updatedPost },
        });
    }

    public async delete(c: Context): Promise<Response> {
        const targetPostId = c.req.param('id') as string;
        const { userId: currentUserId } = c.get('payload');

        const deletedPost = await this.service.delete({
            currentUserId,
            targetPostId,
        });

        return c.shape({
            message: 'post deleted successfully',
            data: { post: deletedPost },
        });
    }
}
