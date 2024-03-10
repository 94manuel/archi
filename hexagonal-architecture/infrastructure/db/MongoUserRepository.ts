import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    // other fields...
});

const UserModel = mongoose.model('User', UserSchema);

export class MongoUserRepository implements UserRepository {
    async add(user: User): Promise<void> {
        const mongooseUser = new UserModel(user);
        await mongooseUser.save();
    }

    async findById(userId: string): Promise<User | null> {
        const user = await UserModel.findById(userId);
        if (!user) {
            return null;
        }
        return new User(user.id, user.name, user.email);
    }
}