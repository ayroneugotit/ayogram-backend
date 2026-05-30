import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { injectable } from 'inversify';

import type { IController } from '../controllers/controller.interface.js';
import { AppError } from '../errors/app.error.js';
import type { IErrorHandler } from '../handlers/error/error.handler.interface.js';
import type { INotFoundHandler } from '../handlers/notfound/notfound.handler.interface.js';
import type { IMiddleware } from '../middlewares/middleware.interface.js';
import type { IAppConfig } from './app.config.interface.js';
import type { IApp } from './app.interface.js';

@injectable()
export abstract class AApp implements IApp {
    private hono: Hono;
    private controllers: IController[];

    public constructor(
        private readonly config: IAppConfig,
        private readonly shapingMiddleware: IMiddleware,
        private readonly notFoundHandler: INotFoundHandler,
        private readonly errorHandler: IErrorHandler,
    ) {
        this.hono = new Hono();
        this.controllers = [];
    }

    protected addController(controller: IController): void {
        if (this.controllers.find((c) => c.path === controller.path)) {
            throw new AppError({
                message: 'controller with this path already exists',
                source: this.constructor.name,
            });
        }

        this.controllers.push(controller);
    }

    private configure(): void {
        this.hono.use(this.shapingMiddleware.handle.bind(this.shapingMiddleware));
        this.hono.notFound(this.notFoundHandler.handle.bind(this.notFoundHandler));
        this.hono.onError(this.errorHandler.handle.bind(this.errorHandler));
        this.hono = this.hono.basePath(this.config.basePath);

        for (const controller of this.controllers) {
            const { endpoints, path: controllerPath } = controller;

            for (const endpoint of endpoints) {
                const { handler, middlewares = [], path: endpointPath = '', method = 'get' } = endpoint;
                const pipeline = [...middlewares.map((m) => m.handle.bind(m)), handler.bind(controller)];
                const path = controllerPath + endpointPath;

                for (const part of pipeline) {
                    this.hono[method](path, part);
                }
            }
        }
    }

    public serve(): void {
        this.configure();

        try {
            serve({
                fetch: this.hono.fetch,
                port: this.config.port,
            });
        } catch {
            throw new AppError({
                message: 'something went wrong while trying to start server',
                source: this.constructor.name,
            });
        }
    }
}
