import { compareSync, hashSync } from 'bcrypt';
import { inject, injectable } from 'inversify';

import type { IAppConfig } from '../../app/app.config.interface.js';
import { IDENTIFIERS } from '../../identifiers.js';
import type { IPasswordService } from './password.service.interface.js';

@injectable()
export class PasswordService implements IPasswordService {
    public constructor(@inject(IDENTIFIERS.AppConfig) private readonly appConfig: IAppConfig) {}

    public hash(password: string): string {
        return hashSync(password, this.appConfig.rounds);
    }

    public verifyHashedPassword(password: string, hashedPassword: string): boolean {
        return compareSync(password, hashedPassword);
    }
}
