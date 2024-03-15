import { User } from '../entities/User';

export interface UserRepository {
    add(user: User): Promise<void>;
    findById(userId: string): Promise<User | null>;
}