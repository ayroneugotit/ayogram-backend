import { inject, injectable } from 'inversify';

import type { IAuthController } from '../../modules/auth/controller/auth.controller.interface.js';
import type { ICommentsController } from '../../modules/comments/controller/comments.controller.interface.js';
import type { ILikesController } from '../../modules/likes/controller/likes.controller.interface.js';
import type { IPostsController } from '../../modules/posts/controller/posts.controller.interface.js';
import type { IProfilesController } from '../../modules/profiles/controller/profiles.controller.interface.js';
import type { IUsersController } from '../../modules/users/controller/users.controller.interface.js';
import type { IErrorHandler } from '../handlers/error/error.handler.interface.js';
import type { INotFoundHandler } from '../handlers/notfound/notfound.handler.interface.js';
import { IDENTIFIERS } from '../identifiers.js';
import type { IMiddleware } from '../middlewares/middleware.interface.js';
import { AApp } from './abstract.app.js';
import type { IAppConfig } from './app.config.interface.js';

@injectable()
export class App extends AApp {
    public constructor(
        @inject(IDENTIFIERS.AppConfig) config: IAppConfig,
        @inject(IDENTIFIERS.ShapingMiddleware) shapingMiddlware: IMiddleware,
        @inject(IDENTIFIERS.NotFoundHandler) notFoundHandler: INotFoundHandler,
        @inject(IDENTIFIERS.ErrorHandler) errorHandler: IErrorHandler,
        @inject(IDENTIFIERS.AuthController) authController: IAuthController,
        @inject(IDENTIFIERS.UsersController) usersController: IUsersController,
        @inject(IDENTIFIERS.ProfilesController) profilesController: IProfilesController,
        @inject(IDENTIFIERS.PostsController) postsController: IPostsController,
        @inject(IDENTIFIERS.CommentsController) commentsController: ICommentsController,
        @inject(IDENTIFIERS.LikesController) likesController: ILikesController,
    ) {
        super(config, shapingMiddlware, notFoundHandler, errorHandler);
        super.addController(authController);
        super.addController(usersController);
        super.addController(profilesController);
        super.addController(postsController);
        super.addController(commentsController);
        super.addController(likesController);
    }
}
