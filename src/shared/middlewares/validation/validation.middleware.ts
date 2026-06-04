import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { Context, Next } from 'hono';

import { HTTPError } from '../../../core/errors/http.error.js';
import type { IMiddlewareFactory } from '../../../core/middlewares/middleware.factory.interface.js';
import type { IMiddleware } from '../../../core/middlewares/middleware.interface.js';

export class ValidationMiddlewareFactory implements IMiddlewareFactory {
    public create(classConstructor: new (...args: unknown[]) => object): IMiddleware {
        return new ValidationMiddleware(classConstructor);
    }
}

export class ValidationMiddleware implements IMiddleware {
    private classConstructor: new (...args: unknown[]) => object;

    public constructor(classConstructor: new (...args: unknown[]) => object) {
        this.classConstructor = classConstructor;
    }

    public async handle(c: Context, n: Next): Promise<void | Response> {
        if (!c.req.header('Content-Type')?.includes('application/json')) {
            throw new HTTPError({
                message: 'request body content-type must be application/json',
                status: 400,
                source: this.constructor.name,
            });
        }

        let plain: unknown;
        try {
            plain = await c.req.json();
        } catch {
            throw new HTTPError({
                message: 'failed to parse json',
                status: 400,
                source: this.constructor.name,
            });
        }

        const instance = plainToInstance(this.classConstructor, plain);
        const errors = await validate(instance);
        if (errors.length > 0) {
            for (const { constraints } of errors) {
                if (!constraints) break;
                for (const message of Object.values(constraints)) {
                    throw new HTTPError({
                        message,
                        status: 400,
                        source: this.constructor.name,
                    });
                }
            }
        }

        await n();
    }
}
