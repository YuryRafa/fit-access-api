import { FastifyInstance } from "fastify";
import { AuthController } from '@/modules/auth/auth-controller';
import { verifyJwt } from "@/middlewares/verify-jwt";

const authController = new AuthController();

export async function authRoutes(app: FastifyInstance) {
    app.post('/register', authController.register.bind(authController));
    
    app.post('/login', authController.login.bind(authController));
    
    app.post('/me',{onRequest:[verifyJwt]}, authController.getUser.bind(authController));
};