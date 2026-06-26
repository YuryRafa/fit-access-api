import { FastifyInstance } from "fastify";
import { GymsController } from '@/modules/gyms/gyms-controller';
import { verifyJwt } from "@/middlewares/verify-jwt";

const gymsController = new GymsController();

export async function gymsRoutes(app: FastifyInstance) {
    app.post('/create', gymsController.createGym.bind(gymsController));
    
    app.post('/search', gymsController.searchGyms.bind(gymsController));
    
    app.post('/find-nearby',{onRequest:[verifyJwt]}, gymsController.getNearbyGyms.bind(gymsController));
};