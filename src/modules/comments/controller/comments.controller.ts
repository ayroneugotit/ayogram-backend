import type { Context } from 'hono';
import { inject, injectable } from 'inversify';

import { AController } from '../../../core/controllers/abstract.controller.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IMiddlewareFactory } from '../../../core/middlewares/middleware.factory.interface.js';
import type { IMiddleware } from '../../../core/middlewares/middleware.interface.js';
import { CommentCreateDTO, CommentUpdateDTO } from '../comments.dto.js';
import type { ICommentsService } from '../service/comments.service.interface.js';
import type { ICommentsController } from './comments.controller.interface.js';

@injectable()
export class CommentsController extends AController implements ICommentsController {
    public constructor(
        @inject(IDENTIFIERS.CommentsService) private readonly service: ICommentsService,
        @inject(IDENTIFIERS.AuthenticationMiddleware) authenticationMiddleware: IMiddleware,
        @inject(IDENTIFIERS.ValidationMiddleware) validationMiddleware: IMiddlewareFactory,
    ) {
        super('/comments');
        super.addEndpoint({
            handler: this.create,
            middlewares: [authenticationMiddleware, validationMiddleware.create(CommentCreateDTO)],
            method: 'post',
        });
        super.addEndpoint({
            handler: this.update,
            middlewares: [authenticationMiddleware, validationMiddleware.create(CommentUpdateDTO)],
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

        const { postId: targetPostId, body } = (await c.req.json()) as CommentCreateDTO;

        const createdComment = await this.service.create({ currentUserId, targetPostId, body });

        return c.shape({
            message: 'comment created successfully',
            data: { comment: createdComment },
            status: 201,
        });
    }

    public async update(c: Context): Promise<Response> {
        const targetCommentId = c.req.param('id') as string;
        const { userId: currentUserId } = c.get('payload');

        const { body } = (await c.req.json()) as CommentUpdateDTO;

        const updatedComment = await this.service.update({ currentUserId, targetCommentId, body });

        return c.shape({
            message: 'comment updated successfully',
            data: { comment: updatedComment },
        });
    }

    public async delete(c: Context): Promise<Response> {
        const targetCommentId = c.req.param('id') as string;
        const { userId: currentUserId } = c.get('payload');

        const deletedComment = await this.service.delete({ currentUserId, targetCommentId });
        return c.shape({
            message: 'comment deleted successfully',
            data: { comment: deletedComment },
        });
    }
}
