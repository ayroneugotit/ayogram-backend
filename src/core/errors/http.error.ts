import type { ContentfulStatusCode } from 'hono/utils/http-status';

import { AppError } from './app.error.js';

export class HTTPError extends AppError {
    public readonly status: ContentfulStatusCode;

    public constructor(options: { message: string; status: ContentfulStatusCode; source?: string }) {
        super(options);

        this.status = options.status;
    }
}
