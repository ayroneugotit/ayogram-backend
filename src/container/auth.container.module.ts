import { ContainerModule } from 'inversify';

import { IDENTIFIERS } from '../core/identifiers.js';
import type { IAuthController } from '../modules/auth/controller/auth.controller.interface.js';
import { AuthController } from '../modules/auth/controller/auth.controller.js';
import type { IAuthService } from '../modules/auth/service/auth.service.interface.js';
import { AuthService } from '../modules/auth/service/auth.service.js';

export function createAuthContainerModule(): ContainerModule {
    return new ContainerModule((options) => {
        const { bind } = options;
        bind<IAuthController>(IDENTIFIERS.AuthController).to(AuthController).inSingletonScope();
        bind<IAuthService>(IDENTIFIERS.AuthService).to(AuthService).inSingletonScope();
    });
}
