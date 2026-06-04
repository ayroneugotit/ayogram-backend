import type { Post } from '../../../../prisma/generated/client.js';

export interface IPostsService {
    create: (options: { currentUserId: string; title: string; body: string }) => Promise<Post>;

    update: (options: {
        currentUserId: string;
        targetPostId: string;
        title?: string;
        body?: string;
    }) => Promise<Post>;

    delete: (options: { currentUserId: string; targetPostId: string }) => Promise<Post>;
}
