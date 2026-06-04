import { inject, injectable } from 'inversify';

import type { Like } from '../../../../prisma/generated/client.js';
import { HTTPError } from '../../../core/errors/http.error.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IPostsGuard } from '../../posts/guard/posts.guard.interface.js';
import type { ILikesGuard } from '../guard/likes.guard.interface.js';
import type { ILikesPolicy } from '../policy/likes.policy.interface.js';
import type { ILikesRepository } from '../repository/likes.repository.interface.js';
import type { ILikesService } from './likes.service.interface.js';

@injectable()
export class LikesService implements ILikesService {
    public constructor(
        @inject(IDENTIFIERS.LikesRepository) private readonly repository: ILikesRepository,
        @inject(IDENTIFIERS.LikesGuard) private readonly likesGuard: ILikesGuard,
        @inject(IDENTIFIERS.PostsGuard) private readonly postsGuard: IPostsGuard,
        @inject(IDENTIFIERS.LikesPolicy) private readonly policy: ILikesPolicy,
    ) {}

    public async create({
        currentUserId,
        targetPostId,
    }: {
        currentUserId: string;
        targetPostId: string;
    }): Promise<Like> {
        await this.postsGuard.ensurePostExists(targetPostId);
        await this.likesGuard.ensureLikeDoesNotExist(currentUserId, targetPostId);

        return this.repository.create(currentUserId, targetPostId);
    }

    public async delete({
        currentUserId,
        targetPostId,
    }: {
        currentUserId: string;
        targetPostId: string;
    }): Promise<Like> {
        await this.postsGuard.ensurePostExists(targetPostId);
        const targetLike = await this.likesGuard.ensureLikeExists(currentUserId, targetPostId);

        if (!this.policy.canDelete(currentUserId, targetLike)) {
            throw new HTTPError({
                message: 'forbidden',
                status: 403,
                source: this.constructor.name,
            });
        }

        return this.repository.delete(currentUserId, targetPostId);
    }
}
