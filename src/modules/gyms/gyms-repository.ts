import { GymsRepositoryInterface } from "@/@types/gyms-interfaces";
import { Gym } from "@/generated/prisma/client";
import { GymCreateInput } from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";

export class GymsRepository implements GymsRepositoryInterface {
    async findGymByid(id: string): Promise<Gym | null> {
        const gym = await prisma.gym.findUnique({where: {id}})
        return gym
    }
    
    async createGym(data: GymCreateInput): Promise<Gym> {
        const gym = await prisma.gym.create({data: data})
        return gym
    }
    
    async searchGyms(query: string, page: number): Promise<Gym[]> {
        const gyms = await prisma.gym.findMany(
            {
                where: {
                title: {
                    contains: query,
                },

            },
            take: 20,
            skip:(page -1) * 20
        })
        return gyms
    }
    
    async findManyNearby(latitude: number, longitude: number): Promise<Gym[]> {
        const nearbyGyms = await prisma.$queryRaw<Gym[]>`
            SELECT * FROM gyms
            WHERE (
                ACOS(
                    SIN(RADIANS(${latitude})) * SIN(RADIANS(latitude)) +
                    COS(RADIANS(${latitude})) * COS(RADIANS(latitude)) * COS(RADIANS(${longitude} - longitude))
                ) * 180 / PI() * 60 * 1.1515 * 1.609344
            ) <= 10
        `

        return nearbyGyms
    }
    
}