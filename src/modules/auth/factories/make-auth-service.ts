import { AuthRepository } from "../auth-repository";
import { AuthService } from "../auth-service";

export function makeAuthService() {
    const authRepository = new AuthRepository();
    const authService = new AuthService(authRepository);

    return authService

}