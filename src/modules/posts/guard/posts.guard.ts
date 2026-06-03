import { inject, injectable } from 'inversify';

import type { Post } from '../../../../prisma/generated/client.js';
import { HTTPError } from '../../../core/errors/http.error.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IPostsRepository } from '../repository/posts.repository.interface.js';
import type { IPostsGuard } from './posts.guard.interface.js';

@injectable()
export class PostsGuard implements IPostsGuard {
    public constructor(@inject(IDENTIFIERS.PostsRepository) private readonly repository: IPostsRepository) {}

    public async ensurePostExists(id: string): Promise<Post> {
        const post = await this.repository.getById(id);
        if (!post) {
            throw new HTTPError({
                message: 'post not found',
                status: 404,
                source: this.constructor.name,
            });
        }
        return post;
    }
}
