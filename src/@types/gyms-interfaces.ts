import { Gym, Prisma } from "@/generated/prisma/client";

export interface CreateGymDto{
    title: string;
    descriptions: string | null;
    phone: string | null;
    latitude: number;
    longitude: number;

}

export interface SearchGymsDTO{
    query: string,
    page: number,
    
}
export interface GetNearbyGymsDTO{
    userLatitude: number,
    userLongitude: number,
    
}

export interface GymsRepositoryInterface{
    findGymByid(id: string):Promise<Gym | null>
    createGym(data: Prisma.GymCreateInput):Promise<Gym>
    searchGyms(query: string, page: number): Promise<Gym[]>
    findManyNearby(latitude: number, longitude: number): Promise<Gym[]>

}