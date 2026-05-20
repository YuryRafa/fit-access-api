import { CheckInsRepositoryInterface } from "@/@types/check-ins-interfaces";
import { CheckIn } from "@/generated/prisma/client";
import { CheckInUncheckedCreateInput } from "@/generated/prisma/models";
import dayjs from "dayjs";
import { randomUUID } from "node:crypto";

export class InMemoryCheckInsRepository implements CheckInsRepositoryInterface{


    public items: CheckIn[] = []

    async createCheckIn(data: CheckInUncheckedCreateInput){
        const checkIn = {
            id:randomUUID(),
            userId: data.userId,
            gymId: data.gymId,
            validated_at: data.validated_at ? new Date(data.validated_at) : null,
            created_at: new Date(),

        }

        this.items.push(checkIn);

        return checkIn
    }

    async findByUserIdOnDate(userId: string, date: Date){
        const startOfTheDay = dayjs(date).startOf('date');
        const endOfTheDay = dayjs(date).endOf('date');


        const checkInOnDate = this.items.find(checkIn => {
            const checkInDate = dayjs(checkIn.created_at)
            const isOnSameDate = 
                checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

            return checkIn.userId === userId && isOnSameDate
        })
        
        if(!checkInOnDate){
            return null
        }

        return checkInOnDate
    }

    async findManyByUserId(userId: string, page: number = 1): Promise<CheckIn[]> {
        const checkIns = this.items
            .filter(checkIn => checkIn.userId === userId)
            .slice((page - 1) * 20, page * 20)
        return checkIns
    }

    async countByUserId(userId: string): Promise<number> {
        const checkInsCount = this.items.filter(checkIn => checkIn.userId === userId).length;
        return checkInsCount
    }

}