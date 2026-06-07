export interface ILogger {
    info: (scope: string, message: string) => void;
    warn: (scope: string, message: string) => void;
    error: (scope: string, message: string) => void;
    fatal: (scope: string, message: string) => void;
}
