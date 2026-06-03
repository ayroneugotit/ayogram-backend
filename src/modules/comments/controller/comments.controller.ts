import type { Context } from 'hono';
import { inject, injectable } from 'inversify';

import { AController } from '../../../core/controllers/abstract.controller.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import { CommentCreateDTO, CommentUpdateDTO } from '../comments.dto.js';
import type { ICommentsService } from '../service/comments.service.interface.js';
import type { ICommentsController } from './comments.controller.interface.js';

@injectable()
export class CommentsController extends AController implements ICommentsController {
    public constructor(@inject(IDENTIFIERS.CommentsService) private readonly service: ICommentsService) {
        super('/comments');
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
        const { postId, userId, body } = (await c.req.json()) as CommentCreateDTO;

        const createdComment = await this.service.create(postId, userId, body);
        return c.shape({
            message: 'comment created successfully',
            data: { comment: createdComment },
            status: 201,
        });
    }

    public async update(c: Context): Promise<Response> {
        const id = c.req.param('id') as string;
        const { body } = (await c.req.json()) as CommentUpdateDTO;

        const updatedComment = await this.service.update(id, body);
        return c.shape({
            message: 'comment updated successfully',
            data: { comment: updatedComment },
        });
    }

    public async delete(c: Context): Promise<Response> {
        const id = c.req.param('id') as string;

        const deletedComment = await this.service.delete(id);
        return c.shape({
            message: 'comment deleted successfully',
            data: { comment: deletedComment },
        });
    }
}
