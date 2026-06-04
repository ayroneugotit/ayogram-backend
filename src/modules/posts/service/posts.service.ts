import { inject, injectable } from 'inversify';

import type { Post } from '../../../../prisma/generated/client.js';
import { HTTPError } from '../../../core/errors/http.error.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IPostsGuard } from '../guard/posts.guard.interface.js';
import type { IPostsPolicy } from '../policy/posts.policy.interface.js';
import type { IPostsRepository } from '../repository/posts.repository.interface.js';
import type { IPostsService } from './posts.service.interface.js';

@injectable()
export class PostsService implements IPostsService {
    public constructor(
        @inject(IDENTIFIERS.PostsRepository) private readonly repository: IPostsRepository,
        @inject(IDENTIFIERS.PostsGuard) private readonly guard: IPostsGuard,
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
        return this.repository.create(currentUserId, title, body);
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
        const targetPost = await this.guard.ensurePostExists(targetPostId);

        if (!this.policy.canUpdate(currentUserId, targetPost)) {
            throw new HTTPError({
                message: 'forbidden',
                status: 403,
                source: this.constructor.name,
            });
        }

        return this.repository.update(targetPostId, title, body);
    }

    public async delete({
        currentUserId,
        targetPostId,
    }: {
        currentUserId: string;
        targetPostId: string;
    }): Promise<Post> {
        const targetPost = await this.guard.ensurePostExists(targetPostId);

        if (!this.policy.canDelete(currentUserId, targetPost)) {
            throw new HTTPError({
                message: 'forbidden',
                status: 403,
                source: this.constructor.name,
            });
        }

        return this.repository.delete(targetPostId);
    }
}
