import { inject, injectable } from 'inversify';

import { IDENTIFIERS } from '../identifiers.js';
import { ALogger } from './abstract.logger.js';
import type { ILoggerTransport } from './logger.transport.interface.js';

@injectable()
export class Logger extends ALogger {
    public constructor(@inject(IDENTIFIERS.ConsoleLogger) consoleLogger: ILoggerTransport) {
        super();
        super.addTransport(consoleLogger);
    }
}
