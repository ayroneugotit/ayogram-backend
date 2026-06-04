import type { Like } from '../../../../prisma/generated/client.js';

export interface ILikesRepository {
    create: (userId: string, postId: string) => Promise<Like>;
    getByPostAndUserIds: (userId: string, postId: string) => Promise<Like | null>;
    delete: (userId: string, postId: string) => Promise<Like>;
}
