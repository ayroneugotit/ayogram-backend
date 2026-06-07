import { ContainerModule } from 'inversify';

import { IDENTIFIERS } from '../core/identifiers.js';
import type { IPostsController } from '../modules/posts/controller/posts.controller.interface.js';
import { PostsController } from '../modules/posts/controller/posts.controller.js';
import type { IPostsPolicy } from '../modules/posts/policy/posts.policy.interface.js';
import { PostsPolicy } from '../modules/posts/policy/posts.policy.js';
import type { IPostsRepository } from '../modules/posts/repository/posts.repository.interface.js';
import { PrismaPostsRepository } from '../modules/posts/repository/prisma.posts.repository.js';
import type { IPostsService } from '../modules/posts/service/posts.service.interface.js';
import { PostsService } from '../modules/posts/service/posts.service.js';

export function createPostsContainerModule(): ContainerModule {
    return new ContainerModule((options) => {
        const { bind } = options;
        bind<IPostsController>(IDENTIFIERS.PostsController).to(PostsController).inSingletonScope();
        bind<IPostsService>(IDENTIFIERS.PostsService).to(PostsService).inSingletonScope();
        bind<IPostsPolicy>(IDENTIFIERS.PostsPolicy).to(PostsPolicy).inSingletonScope();
        bind<IPostsRepository>(IDENTIFIERS.PostsRepository).to(PrismaPostsRepository).inSingletonScope();
    });
}
