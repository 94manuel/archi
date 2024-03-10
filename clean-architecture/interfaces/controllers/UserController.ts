import { Request, Response } from 'express';
import { CreateUser } from '../../application/use_cases/CreateUser';
import { MongooseUserRepository } from '../../infrastructure/database/MongooseUserRepository';

export async function createUser(req: Request, res: Response) {
    const { name, email } = req.body;
    const userRepository = new MongooseUserRepository();
    const createUserUseCase = new CreateUser(userRepository);

    await createUserUseCase.execute(name, email);

    res.status(201).send({ message: 'User created successfully' });
}