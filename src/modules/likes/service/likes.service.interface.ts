import type { Like } from '../../../../prisma/generated/client.js';

export interface ILikesService {
    create: (options: { currentUserId: string; targetPostId: string }) => Promise<Like>;
    delete: (options: { currentUserId: string; targetPostId: string }) => Promise<Like>;
}
