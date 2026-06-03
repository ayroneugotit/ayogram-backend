import { inject, injectable } from 'inversify';

import type { Comment } from '../../../../prisma/generated/client.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IPostsGuard } from '../../posts/guard/posts.guard.interface.js';
import type { IUsersGuard } from '../../users/guard/users.guard.interface.js';
import type { ICommentsGuard } from '../guard/comments.guard.interface.js';
import type { ICommentsRepository } from '../repository/comments.repository.interface.js';
import type { ICommentsService } from './comments.service.interface.js';

@injectable()
export class CommentsService implements ICommentsService {
    public constructor(
        @inject(IDENTIFIERS.CommentsRepository) private readonly repository: ICommentsRepository,
        @inject(IDENTIFIERS.CommentsGuard) private readonly commentsGuard: ICommentsGuard,
        @inject(IDENTIFIERS.PostsGuard) private readonly postsGuard: IPostsGuard,
        @inject(IDENTIFIERS.UsersGuard) private readonly usersGuard: IUsersGuard,
    ) {}

    public async create(postId: string, userId: string, body: string): Promise<Comment> {
        await this.postsGuard.ensurePostExists(postId);
        await this.usersGuard.ensureUserExists(userId);

        return this.repository.create(postId, userId, body);
    }

    public async update(id: string, body: string): Promise<Comment> {
        await this.commentsGuard.ensureCommentExists(id);

        return this.repository.update(id, body);
    }

    public async delete(id: string): Promise<Comment> {
        await this.commentsGuard.ensureCommentExists(id);

        return this.repository.delete(id);
    }
}
