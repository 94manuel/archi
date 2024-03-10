import { Request, Response } from 'express';
import { CreateUser } from '../../application/use_cases/CreateUser';
import { MongoUserRepository } from '../db/MongoUserRepository';

export class UserController {
    static async createUser(req: Request, res: Response) {
        const { name, email } = req.body;
        const userRepository = new MongoUserRepository();
        const createUser = new CreateUser(userRepository);

        await createUser.execute(name, email);

        res.status(201).json({ message: 'User created successfully' });
    }
}