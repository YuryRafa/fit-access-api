import {GymsRepositoryInterface } from "@/@types/gyms-interfaces";
import { Gym, Prisma } from "@/generated/prisma/client";
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
}