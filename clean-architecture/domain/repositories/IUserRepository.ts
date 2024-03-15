import { User } from '../entities/User';

export interface IUserRepository {
    add(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
}