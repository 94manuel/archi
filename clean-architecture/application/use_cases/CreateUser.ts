import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class CreateUser {
    constructor(private userRepository: IUserRepository) {}

    async execute(name: string, email: string): Promise<void> {
        const user = new User(Date.now().toString(), name, email);
        await this.userRepository.add(user);
    }
}