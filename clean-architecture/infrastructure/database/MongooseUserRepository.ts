import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import UserModel from '../database/models/UserModel';

export class MongooseUserRepository implements IUserRepository {
    async add(user: User): Promise<void> {
        const newUser = new UserModel({
            name: user.name,
            email: user.email
        });
        await newUser.save();
    }

    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findById(id);
        if (!user) return null;
        return new User(user.id, user.name, user.email);
    }
}