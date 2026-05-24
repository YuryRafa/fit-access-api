import { CheckInsRepositoryInterface, CreateCheckInDTO, ValidateCheckInDTO } from '@/@types/check-ins-interfaces'
import { GymsRepositoryInterface } from '@/@types/gyms-interfaces';
import { CheckIn } from '@/generated/prisma/client';
import { AppError } from '@/utils/app-error';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';
import dayjs from 'dayjs';

export class CheckInsService {
    constructor(
        private checkInsRepository: CheckInsRepositoryInterface,
        private gymsRepository: GymsRepositoryInterface,

    ) {}

    async checkIn({ userId, gymId, userLatitude, userLongitude }: CreateCheckInDTO): Promise<CheckIn> {
        const gym = await this.gymsRepository.findGymByid(gymId);

        if(!gym){
            throw new AppError("Gym not found",404)
        }

        const distance = getDistanceBetweenCoordinates(
            {latitude: userLatitude, longitude: userLongitude},
            {latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber()}
        )

        const MAX_DISTANCE_IN_KILOMETERS = 0.1;

        if (distance > MAX_DISTANCE_IN_KILOMETERS){
            throw new AppError("You're too far away from the gym", 400)
        }

        const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
            userId,
            new Date()
        );

        if(checkInOnSameDay){
            throw new AppError("Max numbers of check-ins reached", 400)
        };
        
        const checkIn = await this.checkInsRepository.createCheckIn({
            gymId: gymId,
            userId: userId
        });


        
        return checkIn;

    }

    async getUserCheckInHistory({ userId, page = 1 }: { userId: string, page?: number }): Promise<CheckIn[]> {
        const checkIns = await this.checkInsRepository.findManyByUserId(userId, page);
        return checkIns;
    }

    async getUserMetrics(userId: string):Promise<number> {
        const checkInsCount = await this.checkInsRepository.countByUserId(userId);
        return checkInsCount;
    }

    async validateUserCheckIn( {checkInId}:ValidateCheckInDTO):Promise<CheckIn>{
        const checkIn = await this .checkInsRepository.findByid(checkInId);

        if(!checkIn){
            throw new AppError ("Check In Not Found", 404)
        };

        const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
            checkIn.created_at,
            'minutes',
        )

        if(distanceInMinutesFromCheckInCreation > 20){
            throw new AppError ("Check In expired, you can only validate check ins within 20 minutes of its creation", 400)
        }

        checkIn.validated_at = new Date();

        await this.checkInsRepository.saveCheckIn(checkIn)

        return checkIn;

    }

}