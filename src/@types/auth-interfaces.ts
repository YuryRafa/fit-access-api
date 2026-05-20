import { Prisma, User } from "@/generated/prisma/client"

export interface RegisterDto {
    name: string,
    email: string,
    password: string
}
export interface LoginDto {
    email: string,
    password: string
}

export interface GetUser{
    userId: string
}

export interface UsersRepository {
    createUser(data: Prisma.UserCreateInput): Promise<User>,
    findUserByEmail(data: string): Promise<User | null>
    findUserById(id:string): Promise<User | null>
}