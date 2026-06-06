import { AppError } from "@/utils/app-error";
import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJwt(
    request: FastifyRequest, 
    reply: FastifyReply) 
    {

    try {
        await request.jwtVerify()
    } catch (error) {
        if (error instanceof AppError){
            return reply.status(error.statusCode).send({message: error.message})
        }
        throw error
        
    }


}