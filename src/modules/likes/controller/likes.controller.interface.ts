import type { Handler } from 'hono';

import type { IController } from '../../../core/controllers/controller.interface.js';

export interface ILikesController extends IController {
    create: Handler;
    delete: Handler;
}
