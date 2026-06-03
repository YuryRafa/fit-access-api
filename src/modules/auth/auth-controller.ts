/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyRequest, FastifyReply } from 'fastify'
import z from "zod";
import { AppError } from '@/utils/app-error';
import { makeAuthService } from './factories/make-auth-service';

const authService = makeAuthService();

const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
});

const loginBodySchema = z.object({
    email: z.email(),
    password: z.string(),
});

export class AuthController {
    async register(request: FastifyRequest, reply: FastifyReply) {
        const { name, email, password } = registerBodySchema.parse(request.body);
        try {
            const user = await authService.register({ name, email, password });
            const { password_hash: _, ...userWithoutPassword } = user;
            return reply.status(201).send(userWithoutPassword);
        } catch (error) {
            if (error instanceof AppError) {
                return reply.status(error.statusCode).send({ message: error.message });
            }
            throw error;
        }
    }

    async login(request: FastifyRequest, reply: FastifyReply) {
        const { email, password } = loginBodySchema.parse(request.body);
        try {
            const user = await authService.login({ email, password });
            const { password_hash: _, ...userWithoutPassword } = user;
            const token = await reply.jwtSign({}, {
                sign: {
                    sub: user.id,
                }
            });
            return reply.status(200).send({ token, user: userWithoutPassword });
        } catch (error) {
            if (error instanceof AppError) {
                return reply.status(error.statusCode).send({ message: error.message });
            }
            throw error;
        }
    }

    async getUser(request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify();
            const userId = request.user.sub;
            const foundUser = await authService.getUserProfile({ userId });
            const { password_hash: _, ...userWithoutPassword } = foundUser;
            return reply.status(200).send(userWithoutPassword);
        } catch (error) {
            if (error instanceof AppError) {
                return reply.status(error.statusCode).send({ message: error.message });
            }
            throw error;
        }
    }
}