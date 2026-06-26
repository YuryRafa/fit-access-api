import { FastifyRequest } from "fastify";
import { FastifyReply } from "fastify/types/reply";
import { makegymsService } from "./factories/make-gym-service";
import { AppError } from "@/utils/app-error";
import { createGymBodySchema, getNearbyGymsSchema, searchGymsBodySchema } from "./gyms-schemas";

const gymsService = makegymsService()

export class GymsController {
    async createGym(request: FastifyRequest, reply: FastifyReply){
        const {title, descriptions, latitude, longitude , phone } = createGymBodySchema.parse(request.body)
        try {
            const gym = await gymsService.createGym({title, descriptions, latitude, longitude , phone })
        } catch (error) {
            if (error instanceof AppError){
                return reply.status(error.statusCode).send(error.message)
            }
            
        }
    }

    async searchGyms(request: FastifyRequest, reply: FastifyReply){
        const {query, page} = searchGymsBodySchema.parse(request.body)
        try{
            const result = await gymsService.searchGyms({query, page})
            return reply.status(200).send(result)
        } catch(error){
            if (error instanceof AppError){
                return reply.status(error.statusCode).send(error.message)

            }

        }


    }

    async getNearbyGyms(request: FastifyRequest, reply: FastifyReply){
        const {userLatitude, userLongitude} = getNearbyGymsSchema.parse(request.body)
        try{
            const result = gymsService.getNearbyGyms({userLatitude, userLongitude})
            return reply.status(200).send(result);
        } catch (error){
            if (error instanceof AppError){
                return reply.status(error.statusCode).send(error.message)
            }

            
        }

    }
}