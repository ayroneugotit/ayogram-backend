import { injectable } from 'inversify';

import { AppError } from '../errors/app.error.js';
import type { HTTPEndpoint } from '../types/http.endpoint.js';
import type { IController } from './controller.interface.js';

@injectable()
export abstract class AController implements IController {
    public readonly path: string;
    private _endpoints: HTTPEndpoint[];

    public constructor(path: string) {
        this.path = path;
        this._endpoints = [];
    }

    public get endpoints(): readonly HTTPEndpoint[] {
        return this._endpoints;
    }

    protected addEndpoint(endpoint: HTTPEndpoint): void {
        if (this._endpoints.find((e) => e.path === endpoint.path && e.method === endpoint.method)) {
            throw new AppError({
                message: 'endpoint with this path already exists',
                source: this.constructor.name,
            });
        }

        this._endpoints.push(endpoint);
    }
}
