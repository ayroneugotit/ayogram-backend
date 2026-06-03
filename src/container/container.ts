import { Container } from 'inversify';

import { createAppContainerModule } from './app.container.module.js';
import { createAuthContainerModule } from './auth.container.module.js';
import { createCommentsContainerModule } from './comments.container.module.js';
import { createLikesContainerModule } from './likes.container.module.js';
import { createPostsContainerModule } from './posts.container.module.js';
import { createProfilesContainerModule } from './profiles.container.module.js';
import { createUsersContainerModule } from './users.container.module.js';

export function createAppContainer(): Container {
    const appContainer = new Container();
    appContainer.load(createAppContainerModule());
    appContainer.load(createAuthContainerModule());
    appContainer.load(createUsersContainerModule());
    appContainer.load(createProfilesContainerModule());
    appContainer.load(createPostsContainerModule());
    appContainer.load(createCommentsContainerModule());
    appContainer.load(createLikesContainerModule());

    return appContainer;
}
