import type { Context } from 'hono';
import { inject, injectable } from 'inversify';

import { AController } from '../../../core/controllers/abstract.controller.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import { LikeCreateDTO, LikeDeleteDTO } from '../likes.dto.js';
import type { ILikesService } from '../service/likes.service.interface.js';
import type { ILikesController } from './likes.controller.interface.js';

@injectable()
export class LikesController extends AController implements ILikesController {
    public constructor(@inject(IDENTIFIERS.LikesService) private readonly service: ILikesService) {
        super('/likes');
        super.addEndpoint({
            handler: this.create,
            method: 'post',
        });
        super.addEndpoint({
            handler: this.delete,
            method: 'delete',
        });
    }

    public async create(c: Context): Promise<Response> {
        const { postId, userId } = (await c.req.json()) as LikeCreateDTO;

        const createdLike = await this.service.create(postId, userId);
        return c.shape({
            message: 'like created successfully',
            data: { like: createdLike },
            status: 201,
        });
    }

    public async delete(c: Context): Promise<Response> {
        const { postId, userId } = (await c.req.json()) as LikeDeleteDTO;

        const deletedLike = await this.service.delete(postId, userId);
        return c.shape({
            message: 'like deleted successfully',
            data: { like: deletedLike },
        });
    }
}
