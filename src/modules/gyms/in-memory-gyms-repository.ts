import {GymsRepositoryInterface } from "@/@types/gyms-interfaces";
import { Gym, Prisma } from "@/generated/prisma/client";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { randomUUID } from "node:crypto";

export class InMemoryGymsRepository implements GymsRepositoryInterface{

    public items: Gym[] = []
    
    async findGymByid(id: string){
        const gym = this.items.find((item) => item.id === id);
        
        if(!gym){
            return null
        }
        return gym
        
    }

    async createGym(data: Prisma.GymCreateInput): Promise<Gym> {
        const gym ={
            id: data.id ?? randomUUID(),
            title: data.title,
            descriptions: data.descriptions ?? null,
            phone: data.phone ?? null,
            latitude: new Prisma.Decimal(data.latitude.toString()),
            longitude: new Prisma.Decimal(data.longitude.toString()),

        };

        this.items.push(gym);

        return gym
    }

    async searchGyms(query: string, page: number): Promise<Gym[]> {
        return this.items.filter(item => item.title.includes(query)
        ).slice((page - 1) * 20, page *20)
    }

    async findManyNearby(latitude: number, longitude: number): Promise<Gym[]> {
       return this.items.filter((item) => {
        const distance = getDistanceBetweenCoordinates(
            {
                latitude: latitude, 
                longitude: longitude},
            {
                latitude: item.latitude.toNumber(), 
                longitude: item.longitude.toNumber()
            }
        )
        return distance < 10
       });
    }
}