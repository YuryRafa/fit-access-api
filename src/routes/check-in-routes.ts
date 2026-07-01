import { verifyJwt } from "@/middlewares/verify-jwt";
import { CheckInController } from "@/modules/check-ins/check-in-controller";
import { FastifyInstance } from "fastify";

const checkInController = new CheckInController()
export async function checkInRoutes(app: FastifyInstance) {
    app.post('/', {onRequest:[verifyJwt]}, checkInController.checkIn.bind(checkInController));
    app.get('/history/:userId', {onRequest:[verifyJwt]}, checkInController.getUserCheckInHistory.bind(checkInController));
    app.get('/metrics/:userId', {onRequest:[verifyJwt]}, checkInController.getUserMetrics.bind(checkInController));
}