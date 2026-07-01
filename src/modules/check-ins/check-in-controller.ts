import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makecheckInService } from "@/modules/check-ins/factories/make-check-in-service";
import { AppError } from "@/utils/app-error";

const checkInsService = makecheckInService();

const checkInBodySchema = z.object({
  gymId: z.string(),
  userLatitude: z.number(),
  userLongitude: z.number(),
});

export class CheckInController {
  async checkIn(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub; // from the verified JWT
    const { gymId, userLatitude, userLongitude } = checkInBodySchema.parse(request.body);

    try {
      const checkIn = await checkInsService.checkIn({
        userId,
        gymId,
        userLatitude,
        userLongitude,
      });
      return reply.status(201).send(checkIn);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Internal server error' });
    }
  }

  async getUserCheckInHistory(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;
    const { page } = request.query as { page?: string };
    const pageNumber = page ? Number(page) : 1;

    try {
      const checkIns = await checkInsService.getUserCheckInHistory({ userId, page: pageNumber });
      return reply.status(200).send(checkIns);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Internal server error' });
    }
  }

  async getUserMetrics(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;

    try {
      const checkInsCount = await checkInsService.getUserMetrics(userId);
      return reply.status(200).send({ checkInsCount });
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Internal server error' });
    }
  }

  async validateUserCheckIn(request: FastifyRequest, reply: FastifyReply) {
    const { checkInId } = request.params as { checkInId: string };

    try {
      const checkIn = await checkInsService.validateUserCheckIn({ checkInId });
      return reply.status(200).send(checkIn);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Internal server error' });
    }
  }
}