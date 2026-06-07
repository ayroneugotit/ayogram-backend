import { inject, injectable } from 'inversify';

import type { Comment } from '../../../../prisma/generated/client.js';
import { HTTPError } from '../../../core/errors/http.error.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { ILogger } from '../../../core/loggers/logger.interface.js';
import type { IPostsRepository } from '../../posts/repository/posts.repository.interface.js';
import type { ICommentsPolicy } from '../policy/comments.policy.interface.js';
import type { ICommentsRepository } from '../repository/comments.repository.interface.js';
import type { ICommentsService } from './comments.service.interface.js';

@injectable()
export class CommentsService implements ICommentsService {
    public constructor(
        @inject(IDENTIFIERS.Logger) private readonly logger: ILogger,
        @inject(IDENTIFIERS.CommentsRepository) private readonly commentsRepository: ICommentsRepository,
        @inject(IDENTIFIERS.PostsRepository) private readonly postsRepository: IPostsRepository,
        @inject(IDENTIFIERS.CommentsPolicy) private readonly policy: ICommentsPolicy,
    ) {}

    public async create({
        currentUserId,
        targetPostId,
        body,
    }: {
        currentUserId: string;
        targetPostId: string;
        body: string;
    }): Promise<Comment> {
        const targetPost = this.postsRepository.getById(targetPostId);

        if (!targetPost) {
            throw new HTTPError({
                message: 'post not found',
                logMessage: `user '${currentUserId}' attempted to create comment on not existing yet post '${targetPostId}'`,
                status: 404,
                source: this.constructor.name,
            });
        }

        const createdComment = await this.commentsRepository.create(currentUserId, targetPostId, body);

        this.logger.info(
            this.constructor.name,
            `user '${currentUserId}' successfully created comment '${createdComment.id}'`,
        );

        return createdComment;
    }

    public async update({
        currentUserId,
        targetCommentId,
        body,
    }: {
        currentUserId: string;
        targetCommentId: string;
        body: string;
    }): Promise<Comment> {
        const targetComment = await this.commentsRepository.getById(targetCommentId);

        if (!targetComment) {
            throw new HTTPError({
                message: 'comment not found',
                logMessage: `user '${currentUserId} attempted to update not existing yet comment '${targetCommentId}'`,
                status: 404,
                source: this.constructor.name,
            });
        }
        if (!this.policy.canUpdate(currentUserId, targetComment)) {
            throw new HTTPError({
                message: 'forbidden',
                logMessage: `user '${currentUserId} attempted to update comment '${targetCommentId}' without needed right`,
                status: 403,
                source: this.constructor.name,
            });
        }

        const updatedComment = await this.commentsRepository.update(targetCommentId, body);

        this.logger.info(
            this.constructor.name,
            `user '${currentUserId}' successfully updated comment '${updatedComment.id}'`,
        );

        return updatedComment;
    }

    public async delete({
        currentUserId,
        targetCommentId,
    }: {
        currentUserId: string;
        targetCommentId: string;
    }): Promise<Comment> {
        const targetComment = await this.commentsRepository.getById(targetCommentId);

        if (!targetComment) {
            throw new HTTPError({
                message: 'comment not found',
                logMessage: `user '${currentUserId} attempted to delete not existing yet comment '${targetCommentId}'`,
                status: 404,
                source: this.constructor.name,
            });
        }
        if (!this.policy.canUpdate(currentUserId, targetComment)) {
            throw new HTTPError({
                message: 'forbidden',
                logMessage: `user '${currentUserId} attempted to delete comment '${targetCommentId}' without needed right`,
                status: 403,
                source: this.constructor.name,
            });
        }

        const deletedComment = await this.commentsRepository.delete(targetCommentId);

        this.logger.info(
            this.constructor.name,
            `user '${currentUserId}' successfully deleted comment '${deletedComment.id}'`,
        );

        return deletedComment;
    }
}
