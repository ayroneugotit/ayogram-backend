import type { ContentfulStatusCode } from 'hono/utils/http-status';

import { AppError } from './app.error.js';

export class HTTPError extends AppError {
    public readonly status: ContentfulStatusCode;
    public readonly logMessage?: string;

    public constructor(options: {
        message: string;
        status: ContentfulStatusCode;
        source?: string;
        logMessage?: string;
    }) {
        super(options);

        this.status = options.status;
        this.logMessage = options.logMessage;
    }
}
