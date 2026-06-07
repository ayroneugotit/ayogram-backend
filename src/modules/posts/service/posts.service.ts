import { inject, injectable } from 'inversify';

import type { Post } from '../../../../prisma/generated/client.js';
import { HTTPError } from '../../../core/errors/http.error.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { ILogger } from '../../../core/loggers/logger.interface.js';
import type { IPostsPolicy } from '../policy/posts.policy.interface.js';
import type { IPostsRepository } from '../repository/posts.repository.interface.js';
import type { IPostsService } from './posts.service.interface.js';

@injectable()
export class PostsService implements IPostsService {
    public constructor(
        @inject(IDENTIFIERS.Logger) private readonly logger: ILogger,
        @inject(IDENTIFIERS.PostsRepository) private readonly repository: IPostsRepository,
        @inject(IDENTIFIERS.PostsPolicy) private readonly policy: IPostsPolicy,
    ) {}

    public async create({
        currentUserId,
        title,
        body,
    }: {
        currentUserId: string;
        title: string;
        body: string;
    }): Promise<Post> {
        const createdPost = await this.repository.create(currentUserId, title, body);

        this.logger.info(
            this.constructor.name,
            `user '${currentUserId}' successfully created post '${createdPost.id}'`,
        );

        return createdPost;
    }

    public async update({
        currentUserId,
        targetPostId,
        title,
        body,
    }: {
        currentUserId: string;
        targetPostId: string;
        title?: string;
        body?: string;
    }): Promise<Post> {
        const targetPost = await this.repository.getById(targetPostId);

        if (!targetPost) {
            throw new HTTPError({
                message: 'post not found',
                logMessage: `user '${currentUserId}' attempted to update not existing yet post '${targetPostId}'`,
                status: 404,
                source: this.constructor.name,
            });
        }
        if (!this.policy.canUpdate(currentUserId, targetPost)) {
            throw new HTTPError({
                message: 'forbidden',
                logMessage: `user '${currentUserId}' attempted to update post '${targetPostId}' without needed rights`,
                status: 403,
                source: this.constructor.name,
            });
        }

        const createdPost = await this.repository.update(targetPostId, title, body);

        this.logger.info(
            this.constructor.name,
            `user '${currentUserId}' successfully updated post '${targetPostId}'`,
        );

        return createdPost;
    }

    public async delete({
        currentUserId,
        targetPostId,
    }: {
        currentUserId: string;
        targetPostId: string;
    }): Promise<Post> {
        const targetPost = await this.repository.getById(targetPostId);

        if (!targetPost) {
            throw new HTTPError({
                message: 'post not found',
                logMessage: `user '${currentUserId}' attempted to delete not existing yet post '${targetPostId}'`,
                status: 404,
                source: this.constructor.name,
            });
        }
        if (!this.policy.canDelete(currentUserId, targetPost)) {
            throw new HTTPError({
                message: 'forbidden',
                logMessage: `user '${currentUserId}' attempted to delete post '${targetPostId}' without needed rights`,
                status: 403,
                source: this.constructor.name,
            });
        }

        const deletedPost = await this.repository.delete(targetPostId);

        this.logger.info(
            this.constructor.name,
            `user '${currentUserId}' successfully deleted post '${targetPostId}'`,
        );

        return deletedPost;
    }
}
