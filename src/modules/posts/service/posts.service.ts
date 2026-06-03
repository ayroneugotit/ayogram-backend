import { inject, injectable } from 'inversify';

import type { Post } from '../../../../prisma/generated/client.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IUsersGuard } from '../../users/guard/users.guard.interface.js';
import type { IPostsGuard } from '../guard/posts.guard.interface.js';
import type { IPostsRepository } from '../repository/posts.repository.interface.js';
import type { IPostsService } from './posts.service.interface.js';

@injectable()
export class PostsService implements IPostsService {
    public constructor(
        @inject(IDENTIFIERS.PostsRepository) private readonly repository: IPostsRepository,
        @inject(IDENTIFIERS.PostsGuard) private readonly postsGuard: IPostsGuard,
        @inject(IDENTIFIERS.UsersGuard) private readonly usersGuard: IUsersGuard,
    ) {}

    public async create(userId: string, title: string, body: string): Promise<Post> {
        await this.usersGuard.ensureUserExists(userId);

        return this.repository.create(userId, title, body);
    }

    public async update(id: string, title?: string, body?: string): Promise<Post> {
        await this.postsGuard.ensurePostExists(id);

        return this.repository.update(id, title, body);
    }

    public async delete(id: string): Promise<Post> {
        await this.postsGuard.ensurePostExists(id);

        return this.repository.delete(id);
    }
}
