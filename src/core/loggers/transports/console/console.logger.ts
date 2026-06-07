import chalk from 'chalk';
import { injectable } from 'inversify';

import type { LogContext } from '../../../types/log.context.js';
import type { ILoggerTransport } from '../../logger.transport.interface.js';

@injectable()
export class ConsoleLogger implements ILoggerTransport {
    private log(level: string, timestamp: Date, message: string): void {
        console.log(`${level} ${chalk.grey(timestamp.toISOString())} ${message}`);
    }

    public info(c: LogContext): void {
        const level = chalk.green(chalk.bold('INFO'));
        const message = `[${c.scope}] ${c.message}`;
        this.log(level, c.timestamp, message);
    }

    public warn(c: LogContext): void {
        const level = chalk.yellow(chalk.bold('WARN'));
        const message = chalk.yellow(`[${c.scope}] ${c.message}`);
        this.log(level, c.timestamp, message);
    }

    public error(c: LogContext): void {
        const level = chalk.red(chalk.bold('ERROR'));
        const message = chalk.red(`[${c.scope}] ${c.message}`);
        this.log(level, c.timestamp, message);
    }

    public fatal(c: LogContext): void {
        const level = chalk.red(chalk.bold('FATAL'));
        const message = chalk.red(`[${c.scope}] ${c.message}`);
        this.log(level, c.timestamp, message);
    }
}
