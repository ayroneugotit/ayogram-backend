import { inject, injectable } from 'inversify';

import type { Like } from '../../../../prisma/generated/client.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IPostsGuard } from '../../posts/guard/posts.guard.interface.js';
import type { IUsersGuard } from '../../users/guard/users.guard.interface.js';
import type { ILikesGuard } from '../guard/likes.guard.interface.js';
import type { ILikesRepository } from '../repository/likes.repository.interface.js';
import type { ILikesService } from './likes.service.interface.js';

@injectable()
export class LikesService implements ILikesService {
    public constructor(
        @inject(IDENTIFIERS.LikesRepository) private readonly repository: ILikesRepository,
        @inject(IDENTIFIERS.LikesGuard) private readonly likesGuard: ILikesGuard,
        @inject(IDENTIFIERS.PostsGuard) private readonly postsGuard: IPostsGuard,
        @inject(IDENTIFIERS.UsersGuard) private readonly usersGuard: IUsersGuard,
    ) {}

    public async create(postId: string, userId: string): Promise<Like> {
        await this.postsGuard.ensurePostExists(postId);
        await this.usersGuard.ensureUserExists(userId);
        await this.likesGuard.ensureLikeDoesNotExist(postId, userId);

        return this.repository.create(postId, userId);
    }

    public async delete(postId: string, userId: string): Promise<Like> {
        await this.postsGuard.ensurePostExists(postId);
        await this.usersGuard.ensureUserExists(userId);
        await this.likesGuard.ensureLikeExists(postId, userId);

        return this.repository.delete(postId, userId);
    }
}
