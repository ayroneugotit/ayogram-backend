import type { Handler } from 'hono';

import type { IController } from '../../../core/controllers/controller.interface.js';

export interface IProfilesController extends IController {
    update: Handler;
}
