export type JWTPayload = {
    userId: string;
};

export function isJWTPayload(x: unknown): x is JWTPayload {
    if (x instanceof Object && Object.prototype.hasOwnProperty.call(x, 'userId')) {
        return true;
    }
    return false;
}
