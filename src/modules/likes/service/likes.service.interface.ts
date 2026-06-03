import type { Like } from '../../../../prisma/generated/client.js';

export interface ILikesService {
    create: (postId: string, userId: string) => Promise<Like>;
    delete: (postId: string, userId: string) => Promise<Like>;
}
