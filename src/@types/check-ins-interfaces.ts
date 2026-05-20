import { CheckIn, Prisma } from "@/generated/prisma/client";

export interface CreateCheckInDTO {
  userId: string;
  gymId: string;
  userLatitude: number,
  userLongitude: number,
}


export interface CheckInsRepositoryInterface {
    createCheckIn(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
    findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
    findManyByUserId(userId: string, page? :number): Promise<CheckIn[]>
    countByUserId(userId:string):Promise<number>
}