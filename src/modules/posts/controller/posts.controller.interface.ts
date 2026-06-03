import type { Handler } from 'hono';

import type { IController } from '../../../core/controllers/controller.interface.js';

export interface IPostsController extends IController {
    create: Handler;
    update: Handler;
    delete: Handler;
}
