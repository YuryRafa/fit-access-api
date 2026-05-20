import { CreateGymDto, GymsRepositoryInterface } from "@/@types/gyms-interfaces";

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

    




}

