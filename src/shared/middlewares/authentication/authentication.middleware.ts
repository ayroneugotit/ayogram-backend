import type { Context, Next } from 'hono';
import { inject, injectable } from 'inversify';

import { HTTPError } from '../../../core/errors/http.error.js';
import { IDENTIFIERS } from '../../../core/identifiers.js';
import type { IMiddleware } from '../../../core/middlewares/middleware.interface.js';
import type { IJWTService } from '../../../core/security/jwt/jwt.service.interface.js';

@injectable()
export class AuthenticationMiddleware implements IMiddleware {
    public constructor(@inject(IDENTIFIERS.JWTService) private readonly jwtService: IJWTService) {}

    public async handle(c: Context, n: Next): Promise<void | Response> {
        const token = c.req.header('Authorization')?.split(' ')?.at(1);
        if (!token) {
            throw new HTTPError({
                message: 'unauthorized',
                status: 401,
                source: this.constructor.name,
            });
        }

        try {
            const payload = this.jwtService.verifyToken(token);
            c.set('payload', payload);
        } catch {
            throw new HTTPError({
                message: 'unauthorized',
                status: 401,
                source: this.constructor.name,
            });
        }

        await n();
    }
}
