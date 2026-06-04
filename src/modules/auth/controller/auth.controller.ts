import type { Context } from 'hono';
import { inject, injectable } from 'inversify';

import { AController } from '../../../core/controllers/abstract.controller.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IMiddlewareFactory } from '../../../core/middlewares/middleware.factory.interface.js';
import { AuthLoginDTO, AuthRegisterDTO } from '../auth.dto.js';
import type { IAuthService } from '../service/auth.service.interface.js';
import type { IAuthController } from './auth.controller.interface.js';

@injectable()
export class AuthController extends AController implements IAuthController {
    public constructor(
        @inject(IDENTIFIERS.AuthService) private readonly service: IAuthService,
        @inject(IDENTIFIERS.ValidationMiddleware) validationMiddleware: IMiddlewareFactory,
    ) {
        super('/auth');
        super.addEndpoint({
            handler: this.register,
            middlewares: [validationMiddleware.create(AuthRegisterDTO)],
            path: '/register',
            method: 'post',
        });
        super.addEndpoint({
            handler: this.login,
            middlewares: [validationMiddleware.create(AuthLoginDTO)],
            path: '/login',
            method: 'post',
        });
    }

    public async register(c: Context): Promise<Response> {
        const { email, username, password } = (await c.req.json()) as AuthRegisterDTO;

        const token = await this.service.register(email, username, password);
        return c.shape({
            message: 'user registered successfully',
            data: { token },
            status: 201,
        });
    }

    public async login(c: Context): Promise<Response> {
        const { login, password } = (await c.req.json()) as AuthLoginDTO;

        const token = await this.service.login(login, password);
        return c.shape({
            message: 'user logged in successfully',
            data: { token },
        });
    }
}
