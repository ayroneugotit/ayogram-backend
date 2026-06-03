import { ContainerModule } from 'inversify';

import { IDENTIFIERS } from '../core/identifiers.js';
import type { ILikesController } from '../modules/likes/controller/likes.controller.interface.js';
import { LikesController } from '../modules/likes/controller/likes.controller.js';
import type { ILikesGuard } from '../modules/likes/guard/likes.guard.interface.js';
import { LikesGuard } from '../modules/likes/guard/likes.guard.js';
import type { ILikesRepository } from '../modules/likes/repository/likes.repository.interface.js';
import { PrismaLikesRepository } from '../modules/likes/repository/prisma.likes.repository.js';
import type { ILikesService } from '../modules/likes/service/likes.service.interface.js';
import { LikesService } from '../modules/likes/service/likes.service.js';

export function createLikesContainerModule(): ContainerModule {
    return new ContainerModule((options) => {
        const { bind } = options;
        bind<ILikesController>(IDENTIFIERS.LikesController).to(LikesController).inSingletonScope();
        bind<ILikesService>(IDENTIFIERS.LikesService).to(LikesService).inSingletonScope();
        bind<ILikesGuard>(IDENTIFIERS.LikesGuard).to(LikesGuard).inSingletonScope();
        bind<ILikesRepository>(IDENTIFIERS.LikesRepository).to(PrismaLikesRepository).inSingletonScope();
    });
}
