import type { HTTPEndpoint } from '../types/http.endpoint.js';

export interface IController {
    path: string;
    endpoints: readonly HTTPEndpoint[];
}
