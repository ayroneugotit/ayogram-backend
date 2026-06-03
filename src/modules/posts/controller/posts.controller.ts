import type { Context } from 'hono';
import { inject, injectable } from 'inversify';

import { AController } from '../../../core/controllers/abstract.controller.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import { PostCreateDTO, PostUpdateDTO } from '../posts.dto.js';
import type { IPostsService } from '../service/posts.service.interface.js';
import type { IPostsController } from './posts.controller.interface.js';

@injectable()
export class PostsController extends AController implements IPostsController {
    public constructor(@inject(IDENTIFIERS.PostsService) private readonly service: IPostsService) {
        super('/posts');
        super.addEndpoint({
            handler: this.create,
            method: 'post',
        });
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

    public async create(c: Context): Promise<Response> {
        const { userId, title, body } = (await c.req.json()) as PostCreateDTO;

        const createdPost = await this.service.create(userId, title, body);
        return c.shape({
            message: 'post created successfully',
            data: { post: createdPost },
            status: 201,
        });
    }

    public async update(c: Context): Promise<Response> {
        const id = c.req.param('id') as string;
        const { title, body } = (await c.req.json()) as PostUpdateDTO;

        const updatedPost = await this.service.update(id, title, body);
        return c.shape({
            message: 'post updated successfully',
            data: { post: updatedPost },
        });
    }

    public async delete(c: Context): Promise<Response> {
        const id = c.req.param('id') as string;

        const deletedPost = await this.service.delete(id);
        return c.shape({
            message: 'post deleted successfully',
            data: { post: deletedPost },
        });
    }
}
