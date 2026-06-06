import { LoginDto, RegisterDto, UsersRepository, GetUser } from "@/@types/auth-interfaces";
import { User } from "@/generated/prisma/client";
import { AppError } from "@/utils/app-error";
import { hashPassword, validatePassword } from "@/utils/auth-helper";

export class AuthService {
    constructor(private usersRepository: UsersRepository) { }

    async register({ name, email, password }: RegisterDto) {
        const existingEmail = await this.usersRepository.findUserByEmail(email);

        if (existingEmail) {
            throw new AppError("Email already exists!", 409)
        }

        const password_hash = await hashPassword(password);

        const user = await this.usersRepository.createUser({ name, email, password_hash });

        return user;
    }

    async login({ email, password }: LoginDto): Promise<User> {
        const user = await this.usersRepository.findUserByEmail(email);
        if (!user) {
            throw new AppError("Invalid Credentials!", 401);
        };

        const validPassword = await validatePassword(password, user.password_hash);

        if (!validPassword) {
            throw new AppError("Invalid Credentials!", 401);
        };

        return user;
    }

    async getUserProfile({ userId }: GetUser): Promise<User> {
        const user = await this.usersRepository.findUserById(userId);
        if (!user) {
            throw new AppError("User Not Found", 404);
        }
        return user
    }


}

