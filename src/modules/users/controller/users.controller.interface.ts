import type { Handler } from 'hono';

import type { IController } from '../../../core/controllers/controller.interface.js';

export interface IUsersController extends IController {
    update: Handler;
    delete: Handler;
}
