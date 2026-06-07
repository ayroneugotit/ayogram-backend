import { inject, injectable } from 'inversify';

import type { Like } from '../../../../prisma/generated/client.js';
import { HTTPError } from '../../../core/errors/http.error.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { ILogger } from '../../../core/loggers/logger.interface.js';
import type { IPostsRepository } from '../../posts/repository/posts.repository.interface.js';
import type { ILikesPolicy } from '../policy/likes.policy.interface.js';
import type { ILikesRepository } from '../repository/likes.repository.interface.js';
import type { ILikesService } from './likes.service.interface.js';

@injectable()
export class LikesService implements ILikesService {
    public constructor(
        @inject(IDENTIFIERS.Logger) private readonly logger: ILogger,
        @inject(IDENTIFIERS.LikesRepository) private readonly likesRepository: ILikesRepository,
        @inject(IDENTIFIERS.PostsRepository) private readonly postsRepository: IPostsRepository,
        @inject(IDENTIFIERS.LikesPolicy) private readonly policy: ILikesPolicy,
    ) {}

    public async create({
        currentUserId,
        targetPostId,
    }: {
        currentUserId: string;
        targetPostId: string;
    }): Promise<Like> {
        const targetPost = await this.postsRepository.getById(targetPostId);
        const existingLike = await this.likesRepository.getByPostAndUserIds(currentUserId, targetPostId);

        if (!targetPost) {
            throw new HTTPError({
                message: 'post not found',
                logMessage: `user '${currentUserId}' attempted to create like on not existing yet post '${targetPostId}'`,
                status: 404,
                source: this.constructor.name,
            });
        }
        if (existingLike) {
            throw new HTTPError({
                message: 'this user already liked this post',
                logMessage: `user '${currentUserId}' attempted to create like on post '${targetPostId}' twice`,
                status: 409,
                source: this.constructor.name,
            });
        }

        const createdLike = await this.likesRepository.create(currentUserId, targetPostId);

        this.logger.info(
            this.constructor.name,
            `user '${currentUserId}' successfully created like '${createdLike.id}'`,
        );

        return createdLike;
    }

    public async delete({
        currentUserId,
        targetPostId,
    }: {
        currentUserId: string;
        targetPostId: string;
    }): Promise<Like> {
        const targetPost = await this.postsRepository.getById(targetPostId);
        const targetLike = await this.likesRepository.getByPostAndUserIds(currentUserId, targetPostId);

        if (!targetPost) {
            throw new HTTPError({
                message: 'post not found',
                logMessage: `user '${currentUserId}' attempted to delete like from not existing yet post '${targetPostId}'`,
                status: 404,
                source: this.constructor.name,
            });
        }
        if (!targetLike) {
            throw new HTTPError({
                message: 'like not found',
                logMessage: `user '${currentUserId}' attempted to delete not existing yet like from post '${targetPostId}'`,
                status: 404,
                source: this.constructor.name,
            });
        }
        if (!this.policy.canDelete(currentUserId, targetLike)) {
            throw new HTTPError({
                message: 'forbidden',
                logMessage: `user '${currentUserId}' attempted to delete like '${targetLike.id}' without needed rights`,
                status: 403,
                source: this.constructor.name,
            });
        }

        const deletedLike = await this.likesRepository.delete(currentUserId, targetPostId);

        this.logger.info(
            this.constructor.name,
            `user '${currentUserId}' successfully deleted like '${deletedLike.id}'`,
        );

        return deletedLike;
    }
}
