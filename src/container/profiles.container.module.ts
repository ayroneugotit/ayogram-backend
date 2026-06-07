import { ContainerModule } from 'inversify';

import { IDENTIFIERS } from '../core/identifiers.js';
import type { IProfilesController } from '../modules/profiles/controller/profiles.controller.interface.js';
import { ProfilesController } from '../modules/profiles/controller/profiles.controller.js';
import type { IProfilesPolicy } from '../modules/profiles/policy/profiles.policy.interface.js';
import { ProfilesPolicy } from '../modules/profiles/policy/profiles.policy.js';
import { PrismaProfilesRepository } from '../modules/profiles/repository/prisma.profiles.repository.js';
import type { IProfilesRepository } from '../modules/profiles/repository/profiles.repository.interface.js';
import type { IProfilesService } from '../modules/profiles/service/profiles.service.interface.js';
import { ProfilesService } from '../modules/profiles/service/profiles.service.js';

export function createProfilesContainerModule(): ContainerModule {
    return new ContainerModule((options) => {
        const { bind } = options;
        bind<IProfilesController>(IDENTIFIERS.ProfilesController).to(ProfilesController).inSingletonScope();
        bind<IProfilesService>(IDENTIFIERS.ProfilesService).to(ProfilesService).inSingletonScope();
        bind<IProfilesPolicy>(IDENTIFIERS.ProfilesPolicy).to(ProfilesPolicy).inSingletonScope();
        bind<IProfilesRepository>(IDENTIFIERS.ProfilesRepository)
            .to(PrismaProfilesRepository)
            .inSingletonScope();
    });
}
