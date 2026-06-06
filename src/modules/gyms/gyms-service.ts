import { CreateGymDto, GetNearbyGymsDTO, GymsRepositoryInterface, SearchGymsDTO } from "@/@types/gyms-interfaces";
import { Gym } from "@/generated/prisma/client";

export class GymsService {
    constructor(private gymsRepository: GymsRepositoryInterface) { }

    async createGym({ title, descriptions, latitude, longitude , phone }: CreateGymDto) {
        const gym = await this.gymsRepository.createGym({
            title, 
            descriptions, 
            latitude, 
            longitude , 
            phone
        });

        return{gym}
    }

    async searchGyms({query, page}: SearchGymsDTO): Promise<Gym[]>{
        const gyms = await this.gymsRepository.searchGyms(query, page)
        return gyms
    }
    
    async getNearbyGyms({userLatitude, userLongitude}: GetNearbyGymsDTO): Promise<Gym[]>{
        const gyms = await this.gymsRepository.findManyNearby(userLatitude, userLongitude)
        return gyms
    }

    




}

