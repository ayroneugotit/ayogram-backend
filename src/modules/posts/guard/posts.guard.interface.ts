import type { Post } from '../../../../prisma/generated/client.js';

export interface IPostsGuard {
    ensurePostExists: (id: string) => Promise<Post>;
}
