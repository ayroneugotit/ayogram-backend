import { ContainerModule } from 'inversify';

import { IDENTIFIERS } from '../core/identifiers.js';
import type { ICommentsController } from '../modules/comments/controller/comments.controller.interface.js';
import { CommentsController } from '../modules/comments/controller/comments.controller.js';
import type { ICommentsPolicy } from '../modules/comments/policy/comments.policy.interface.js';
import { CommentsPolicy } from '../modules/comments/policy/comments.policy.js';
import type { ICommentsRepository } from '../modules/comments/repository/comments.repository.interface.js';
import { PrismaCommentsRepository } from '../modules/comments/repository/prisma.comments.repository.js';
import type { ICommentsService } from '../modules/comments/service/comments.service.interface.js';
import { CommentsService } from '../modules/comments/service/comments.service.js';

export function createCommentsContainerModule(): ContainerModule {
    return new ContainerModule((options) => {
        const { bind } = options;
        bind<ICommentsController>(IDENTIFIERS.CommentsController).to(CommentsController).inSingletonScope();
        bind<ICommentsService>(IDENTIFIERS.CommentsService).to(CommentsService).inSingletonScope();
        bind<ICommentsPolicy>(IDENTIFIERS.CommentsPolicy).to(CommentsPolicy).inSingletonScope();
        bind<ICommentsRepository>(IDENTIFIERS.CommentsRepository)
            .to(PrismaCommentsRepository)
            .inSingletonScope();
    });
}
