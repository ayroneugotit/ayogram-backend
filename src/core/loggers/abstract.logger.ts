import { injectable } from 'inversify';

import type { ILogger } from './logger.interface.js';
import type { ILoggerTransport } from './logger.transport.interface.js';

@injectable()
export abstract class ALogger implements ILogger {
    private transports: ILoggerTransport[];

    public constructor() {
        this.transports = [];
    }

    public addTransport(transport: ILoggerTransport): void {
        this.transports.push(transport);
    }

    public info(scope: string, message: string): void {
        for (const transport of this.transports) {
            transport.info({
                scope,
                message,
                timestamp: new Date(),
            });
        }
    }

    public warn(scope: string, message: string): void {
        for (const transport of this.transports) {
            transport.warn({
                scope,
                message,
                timestamp: new Date(),
            });
        }
    }

    public error(scope: string, message: string): void {
        for (const transport of this.transports) {
            transport.error({
                scope,
                message,
                timestamp: new Date(),
            });
        }
    }

    public fatal(scope: string, message: string): void {
        for (const transport of this.transports) {
            transport.fatal({
                scope,
                message,
                timestamp: new Date(),
            });
        }
    }
}
