import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/modules/check-ins/in-memory-check-in-repository';
import { CheckInsService } from './check-in-service';
import { InMemoryGymsRepository } from '../gyms/in-memory-gyms-repository';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let service: CheckInsService;

describe('CheckIn Use Case', async () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        service = new CheckInsService(checkInsRepository, gymsRepository);

        await gymsRepository.createGym({
            id: 'gym-01',
            title: 'test gym',
            descriptions: '',
            phone: '',
            latitude: -5.0383677,
            longitude: -42.8814664
        })

        vi.useFakeTimers()
    });

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check-in', async () => {
        vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0))
        const checkIn = await service.checkIn({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -5.0383677,
            userLongitude: -42.8814664,
        });
        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check-in twice on the same day', async () => {
        vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))
        await service.checkIn({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -5.0383677,
            userLongitude: -42.8814664,
        });

        await expect(() => service.checkIn({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -5.0383677,
            userLongitude: -42.8814664,
        })).rejects.toBeInstanceOf(Error)
    });

    it('should be able to check-in twice on DIFFERENT DAYS', async () => {
        vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))
        await service.checkIn({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -5.0383677,
            userLongitude: -42.8814664,
        });
        vi.setSystemTime(new Date(2025, 0, 21, 8, 0, 0))

        const checkIn = await service.checkIn({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -5.0383677,
            userLongitude: -42.8814664,
        })
        expect(checkIn.id).toEqual(expect.any(String))
    });

    it('should not be able to check-in on distant gym', async () => {
        vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0))
        await expect(() =>
            service.checkIn({
                gymId: 'gym-01',
                userId: 'user-01',
                userLatitude: -3.7325,
                userLongitude: -38.5260,
            })
        ).rejects.toBeInstanceOf(Error)
    });
});


describe('Fetch CheckIn Use Case', async () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        service = new CheckInsService(checkInsRepository, gymsRepository);
    })
    it('should be able to fetch user check-ins history', async () => {
    
        await checkInsRepository.createCheckIn({
            gymId: 'gym-01',
            userId: 'user-01',

        })

            
        await checkInsRepository.createCheckIn({
            gymId: 'gym-02',
            userId: 'user-01',

        })


        const checkIns = await service.getUserCheckInHistory({
            userId: 'user-01'
        })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({gymId: 'gym-01'}),
            expect.objectContaining({gymId: 'gym-02'})
        ])

    })
    
    it('should be able to fetch paginated user check-ins history', async () => {
        for(let i = 1; i <= 22; i++){
            await checkInsRepository.createCheckIn({
                gymId: `gym-${i}`,
                userId: 'user-01',
            })
        }

        const page1 = await service.getUserCheckInHistory({ userId: 'user-01', page: 1 })
        const page2 = await service.getUserCheckInHistory({ userId: 'user-01', page: 2 })

        expect(page1).toHaveLength(20)
        expect(page2).toHaveLength(2)
    })
})

describe('Get user metrics use case', async () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        service = new CheckInsService(checkInsRepository, gymsRepository);
    })
    it('should be able to get check ins count from metrics', async () => {
    
        await checkInsRepository.createCheckIn({
            gymId: 'gym-01',
            userId: 'user-01',

        })

            
        await checkInsRepository.createCheckIn({
            gymId: 'gym-02',
            userId: 'user-01',

        })


        const checkInsCount = await service.getUserMetrics('user-01')

        expect(checkInsCount).toEqual(2)
    })
})
