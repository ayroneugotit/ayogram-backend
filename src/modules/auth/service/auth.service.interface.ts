export interface IAuthService {
    register: (email: string, username: string, password: string) => Promise<string>;
    login: (login: string, password: string) => Promise<string>;
}
