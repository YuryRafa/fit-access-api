import { InMemoryGymsRepository } from "./in-memory-gyms-repository";
import{expect, describe, it, beforeEach} from 'vitest';
import { GymsService } from "./gyms-service";

let gymsRepository: InMemoryGymsRepository;
let service: GymsService;

describe('Create gym use case', () =>{
    beforeEach(()=> {
        gymsRepository = new InMemoryGymsRepository();
        service = new GymsService(gymsRepository);

    });

    it('should be able to create a gym', async () => {
        const {gym} = await service.createGym({
            title:'gym test',
            descriptions: null,
            phone: null,
            latitude: -5.0383677,
            longitude: -42.8814664,

        })

        expect(gym.id).toEqual(expect.any(String))

    })

})