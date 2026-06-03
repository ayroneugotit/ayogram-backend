import type { Post } from '../../../../prisma/generated/client.js';

export interface IPostsRepository {
    create: (userId: string, title: string, body: string) => Promise<Post>;
    getById: (id: string) => Promise<Post | null>;
    update: (id: string, title?: string, body?: string) => Promise<Post>;
    delete: (id: string) => Promise<Post>;
}
