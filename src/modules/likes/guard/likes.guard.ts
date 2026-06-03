import { inject, injectable } from 'inversify';

import type { Like } from '../../../../prisma/generated/client.js';
import { HTTPError } from '../../../core/errors/http.error.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { ILikesRepository } from '../repository/likes.repository.interface.js';
import type { ILikesGuard } from './likes.guard.interface.js';

@injectable()
export class LikesGuard implements ILikesGuard {
    public constructor(@inject(IDENTIFIERS.LikesRepository) private readonly repository: ILikesRepository) {}

    public async ensureLikeExists(postId: string, userId: string): Promise<Like> {
        const like = await this.repository.getByPostAndUserIds(postId, userId);
        if (!like) {
            throw new HTTPError({
                message: 'like not found',
                status: 404,
                source: this.constructor.name,
            });
        }
        return like;
    }

    public async ensureLikeDoesNotExist(postId: string, userId: string): Promise<void> {
        const like = await this.repository.getByPostAndUserIds(postId, userId);
        if (like) {
            throw new HTTPError({
                message: 'this user already liked this post',
                status: 409,
                source: this.constructor.name,
            });
        }
    }
}
