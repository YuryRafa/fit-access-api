import { FastifyInstance } from "fastify";
import { AuthController } from '@/modules/auth/auth-controller';

const authController = new AuthController();

export async function appRoutes(app: FastifyInstance) {
    app.post('/auth/register', authController.register);
    app.post('/auth/login', authController.login);
    app.post('/auth/me', authController.getUser);
};