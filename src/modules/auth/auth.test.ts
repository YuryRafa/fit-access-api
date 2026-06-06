import { beforeEach, describe, expect, it } from 'vitest';
import bcrypt from 'bcrypt';
import { AuthService } from './auth-service';
import { InMemoryAuthRepository } from '@/modules/auth/in-memory-auth-repository';

let authRepository: InMemoryAuthRepository;
let service: AuthService;

describe('Register Use Case', async () => {

    beforeEach(() => {
        authRepository = new InMemoryAuthRepository()
        service = new AuthService(authRepository);
        
    });

    it('should be able to register', async () => {


        const user = await service.register({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456'

        });

        expect(user.id).toEqual(expect.any(String));
    });

    it('should hash user password upon registration', async () => {

        const user = await service.register({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456'

        });

        const isPasswordHashed = await bcrypt.compare(
            '123456',
            user.password_hash
        );

        expect(isPasswordHashed).toBe(true);
    });

    it('not be able to use the same email twice', async () => {

        const email = 'johndoe@email.com';

        await service.register({
            name: 'John Doe',
            email: email,
            password: '123456'

        });

        await expect(() =>
            service.register({
                name: 'John Doe',
                email: email,
                password: '123456'

            })


        ).rejects.toThrow('Email already exists!');

    });
});

describe('Login Use Case', async () => {

    beforeEach(() => {
        authRepository = new InMemoryAuthRepository()
        service = new AuthService(authRepository);
        
    });

    it('Should be able to authenticate', async () => {

        await authRepository.createUser({
            name:'John Doe',
            email:'johndoe@email.com',
            password_hash: await bcrypt.hash('123456', 6)
        })

        const user = await service.login({
            email: 'johndoe@email.com',
            password: '123456',
        });

        expect(user.id).toEqual(expect.any(String));

    });
    
    it('Should not be able to authenticate with wrong email', async () => {

        await expect(() => 
            service.login({
            email: 'johndoee@email.com',
            password: '123456',
        })
        ).rejects.toThrow("Invalid Credentials!")
    });
    
    it('Should not be able to authenticate with wrong password', async () => {

        await expect(() => 
            service.login({
            email: 'johndoe@email.com',
            password: '1234567',
        })
        ).rejects.toThrow("Invalid Credentials!")
    });

    it('Should be able to get user profile', async () => {
        const createUser = await service.register({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: await bcrypt.hash('123456', 6)
        });


        const user = await service.getUserProfile({
            userId: createUser.id
        });


        expect(user.name).toEqual('John Doe');



    })

});