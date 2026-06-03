import { inject, injectable } from 'inversify';

import type { Comment } from '../../../../prisma/generated/client.js';
import { HTTPError } from '../../../core/errors/http.error.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { ICommentsRepository } from '../repository/comments.repository.interface.js';
import type { ICommentsGuard } from './comments.guard.interface.js';

@injectable()
export class CommentsGuard implements ICommentsGuard {
    public constructor(
        @inject(IDENTIFIERS.CommentsRepository) private readonly repository: ICommentsRepository,
    ) {}

    public async ensureCommentExists(id: string): Promise<Comment> {
        const comment = await this.repository.getById(id);
        if (!comment) {
            throw new HTTPError({
                message: 'comment not found',
                status: 404,
                source: this.constructor.name,
            });
        }
        return comment;
    }
}
