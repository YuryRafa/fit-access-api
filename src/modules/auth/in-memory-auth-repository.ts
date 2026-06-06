import { UsersRepository } from "@/@types/auth-interfaces";
import { Prisma, User } from "@/generated/prisma/client";
import { randomUUID } from "node:crypto";

export class InMemoryAuthRepository implements UsersRepository {
    public items: User[] = []

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        const user = {
            id: randomUUID(),
            name: data.name,
            email: data.email,
            password_hash: data.password_hash,
            created_at: new Date()
        }

        this.items.push(user);
        return user
    };

    async findUserByEmail(email: string) {
        const user = this.items.find(item => item.email === email);
        if (!user) {
            return null
        };

        return user;

    };

    async findUserById(id: string): Promise<User | null> {
        const user = this.items.find(item => item.id === id);

        if (!user) {
            return null
        };

        return user;

    }

}