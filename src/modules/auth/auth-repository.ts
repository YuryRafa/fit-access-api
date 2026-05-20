import { UsersRepository } from "@/@types/auth-interfaces";
import { Prisma, User } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";


export class AuthRepository implements UsersRepository {

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return await prisma.user.create({data});
    }

    async findUserByEmail(email: string) {
        return await prisma.user.findUnique({ where: { email } });
    }

    async findUserById(id: string): Promise<User | null> {
        return await prisma.user.findUnique({where: {id}});
        
    }

}

