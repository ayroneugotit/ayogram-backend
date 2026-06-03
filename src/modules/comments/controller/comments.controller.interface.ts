import type { Handler } from 'hono';

import type { IController } from '../../../core/controllers/controller.interface.js';

export interface ICommentsController extends IController {
    create: Handler;
    update: Handler;
    delete: Handler;
}
