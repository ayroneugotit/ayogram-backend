import { inject, injectable } from 'inversify';

import type { Comment } from '../../../../prisma/generated/client.js';
import { HTTPError } from '../../../core/errors/http.error.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IPostsGuard } from '../../posts/guard/posts.guard.interface.js';
import type { ICommentsGuard } from '../guard/comments.guard.interface.js';
import type { ICommentsPolicy } from '../policy/comments.policy.interface.js';
import type { ICommentsRepository } from '../repository/comments.repository.interface.js';
import type { ICommentsService } from './comments.service.interface.js';

@injectable()
export class CommentsService implements ICommentsService {
    public constructor(
        @inject(IDENTIFIERS.CommentsRepository) private readonly repository: ICommentsRepository,
        @inject(IDENTIFIERS.CommentsGuard) private readonly commentsGuard: ICommentsGuard,
        @inject(IDENTIFIERS.PostsGuard) private readonly postsGuard: IPostsGuard,
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
        await this.postsGuard.ensurePostExists(targetPostId);

        return this.repository.create(currentUserId, targetPostId, body);
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
        const targetComment = await this.commentsGuard.ensureCommentExists(targetCommentId);

        if (!this.policy.canUpdate(currentUserId, targetComment)) {
            throw new HTTPError({
                message: 'forbidden',
                status: 403,
                source: this.constructor.name,
            });
        }

        return this.repository.update(targetCommentId, body);
    }

    public async delete({
        currentUserId,
        targetCommentId,
    }: {
        currentUserId: string;
        targetCommentId: string;
    }): Promise<Comment> {
        const targetComment = await this.commentsGuard.ensureCommentExists(targetCommentId);

        if (!this.policy.canUpdate(currentUserId, targetComment)) {
            throw new HTTPError({
                message: 'forbidden',
                status: 403,
                source: this.constructor.name,
            });
        }

        return this.repository.delete(targetCommentId);
    }
}
