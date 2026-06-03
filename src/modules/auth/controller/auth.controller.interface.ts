import type { Handler } from 'hono';

import type { IController } from '../../../core/controllers/controller.interface.js';

export interface IAuthController extends IController {
    register: Handler;
    login: Handler;
}
