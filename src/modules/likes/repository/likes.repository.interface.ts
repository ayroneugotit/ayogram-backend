import type { Like } from '../../../../prisma/generated/client.js';

export interface ILikesRepository {
    create: (postId: string, userId: string) => Promise<Like>;
    getByPostAndUserIds: (postId: string, userId: string) => Promise<Like | null>;
    delete: (postId: string, userId: string) => Promise<Like>;
}
