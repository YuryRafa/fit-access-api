import { CheckInsRepositoryInterface } from "@/@types/check-ins-interfaces";
import { CheckIn } from "@/generated/prisma/client";
import { CheckInUncheckedCreateInput } from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export class CheckInsRepository implements CheckInsRepositoryInterface{

    async createCheckIn(data: CheckInUncheckedCreateInput): Promise<CheckIn> {
        return await prisma.checkIn.create({data})
    }

    async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
        const startOfTheDay = dayjs(date).startOf('date').toDate();
        const endOfTheDay = dayjs(date).endOf('date').toDate();

        const checkInOnDate = await prisma.checkIn.findFirst({
            where: {
                userId,
                created_at: {
                    gte: startOfTheDay,
                    lte: endOfTheDay,
                }
            }
        });

        return checkInOnDate;
    }

    async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
        const checkIns = await prisma.checkIn.findMany({
            where: { userId },
            take: 20,
            skip: (page - 1) * 20,
        });
        return checkIns
    }

    async countByUserId(userId: string): Promise<number> {
        return await prisma.checkIn.count({
            where: { userId }
    });
}


}