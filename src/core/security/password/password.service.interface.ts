export interface IPasswordService {
    hash: (password: string) => string;
    verifyHashedPassword: (password: string, hashedPassword: string) => boolean;
}
