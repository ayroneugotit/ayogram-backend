import { ContainerModule } from 'inversify';

import { IDENTIFIERS } from '../core/identifiers.js';
import type { IUsersController } from '../modules/users/controller/users.controller.interface.js';
import { UsersController } from '../modules/users/controller/users.controller.js';
import type { IUsersGuard } from '../modules/users/guard/users.guard.interface.js';
import { UsersGuard } from '../modules/users/guard/users.guard.js';
import { PrismaUsersRepository } from '../modules/users/repository/prisma.users.repository.js';
import type { IUsersRepository } from '../modules/users/repository/users.repository.interface.js';
import type { IUsersService } from '../modules/users/service/users.service.interface.js';
import { UsersService } from '../modules/users/service/users.service.js';

export function createUsersContainerModule(): ContainerModule {
    return new ContainerModule((options) => {
        const { bind } = options;
        bind<IUsersController>(IDENTIFIERS.UsersController).to(UsersController).inSingletonScope();
        bind<IUsersService>(IDENTIFIERS.UsersService).to(UsersService).inSingletonScope();
        bind<IUsersGuard>(IDENTIFIERS.UsersGuard).to(UsersGuard).inSingletonScope();
        bind<IUsersRepository>(IDENTIFIERS.UsersRepository).to(PrismaUsersRepository).inSingletonScope();
    });
}
