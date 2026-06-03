import type { Context } from 'hono';
import { inject, injectable } from 'inversify';

import { AController } from '../../../core/controllers/abstract.controller.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import { AuthLoginDTO, AuthRegisterDTO } from '../auth.dto.js';
import type { IAuthService } from '../service/auth.service.interface.js';
import type { IAuthController } from './auth.controller.interface.js';

@injectable()
export class AuthController extends AController implements IAuthController {
    public constructor(@inject(IDENTIFIERS.AuthService) private readonly service: IAuthService) {
        super('/auth');
        super.addEndpoint({
            handler: this.register,
            path: '/register',
            method: 'post',
        });
        super.addEndpoint({
            handler: this.login,
            path: '/login',
            method: 'post',
        });
    }

    public async register(c: Context): Promise<Response> {
        const { email, username, password } = (await c.req.json()) as AuthRegisterDTO;

        const createdUser = await this.service.register(email, username, password);
        return c.shape({
            message: 'user registered successfully',
            data: { user: createdUser },
            status: 201,
        });
    }

    public async login(c: Context): Promise<Response> {
        const { login, password } = (await c.req.json()) as AuthLoginDTO;

        const targetUser = await this.service.login(login, password);
        return c.shape({
            message: 'user logged in successfully',
            data: { user: targetUser },
        });
    }
}
