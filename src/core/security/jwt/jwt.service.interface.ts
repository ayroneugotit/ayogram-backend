import type { JWTPayload } from '../../types/jwt.payload.js';

export interface IJWTService {
    generateToken: (userId: string) => string;
    verifyToken: (token: string) => JWTPayload;
}
