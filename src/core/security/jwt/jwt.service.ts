import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import type { IAppConfig } from '../../app/app.config.interface.js';
import { AppError } from '../../errors/app.error.js';
import { IDENTIFIERS } from '../../identifiers.js';
import { isJWTPayload, type JWTPayload } from '../../types/jwt.payload.js';
import type { IJWTService } from './jwt.service.interface.js';

@injectable()
export class JWTService implements IJWTService {
    public constructor(@inject(IDENTIFIERS.AppConfig) private readonly appConfig: IAppConfig) {}

    private sign(payload: JWTPayload): string {
        return jwt.sign(payload, this.appConfig.secret, { expiresIn: '15m' });
    }

    public generateToken(userId: string): string {
        return this.sign({ userId });
    }

    public verifyToken(token: string): JWTPayload {
        const payload = jwt.verify(token, this.appConfig.secret);
        if (!isJWTPayload(payload)) {
            throw new AppError({ message: 'invalid token payload', source: this.constructor.name });
        }
        return payload;
    }
}
