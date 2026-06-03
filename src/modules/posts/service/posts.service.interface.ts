import type { Post } from '../../../../prisma/generated/client.js';

export interface IPostsService {
    create: (userId: string, title: string, body: string) => Promise<Post>;
    update: (id: string, title?: string, body?: string) => Promise<Post>;
    delete: (id: string) => Promise<Post>;
}
