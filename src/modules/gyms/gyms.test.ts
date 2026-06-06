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

describe('Search gym use case', () =>{
    beforeEach(()=> {
        gymsRepository = new InMemoryGymsRepository();
        service = new GymsService(gymsRepository);

    });

    it('should be able to search for gyms', async () => {
        await service.createGym({
            title:'gym test',
            descriptions: null,
            phone: null,
            latitude: -5.0383677,
            longitude: -42.8814664,

        })
        
        await service.createGym({
            title:'gym test 2',
            descriptions: null,
            phone: null,
            latitude: -5.0383677,
            longitude: -42.8814664,

        })

        const gyms = await service.searchGyms({
            query: 'gym test 2',
            page: 1
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([expect.objectContaining({title: 'gym test 2'})])

    })
    it('should be able to get a paginated gyms search', async () => {
        for(let i = 1; i <= 22; i++){
            await service.createGym({
                title:`gym test ${i}`,
                descriptions: null,
                phone: null,
                latitude: -5.0383677,
                longitude: -42.8814664,

            })
        }

        const gyms = await service.searchGyms({
            query: 'gym test',
            page: 2,
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({title: 'gym test 21'}),
            expect.objectContaining({title: 'gym test 22'})
        ])

    })

})
describe('Search gym use case', () =>{
    beforeEach(()=> {
        gymsRepository = new InMemoryGymsRepository();
        service = new GymsService(gymsRepository);

    });

    it('should be able to fetch nearby gyms', async () => {
        await service.createGym({
            title:'near gym',
            descriptions: null,
            phone: null,
            latitude: -5.0383677,
            longitude: -42.8814664,

        })
        
        await service.createGym({
            title: 'far gym',
            descriptions: null,
            phone: null,
            latitude: -5.1383677,
            longitude: -42.8814664,
        })

        const gyms = await service.getNearbyGyms({
            userLatitude: -5.0383677,
            userLongitude: -42.8814664,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([expect.objectContaining({title: 'near gym'})])

    })

})


