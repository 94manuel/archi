import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';

export class CreateUser {
    constructor(private userRepository: UserRepository) {}

    async execute(name: string, email: string): Promise<void> {
        const user = new User(Date.now().toString(), name, email);
        await this.userRepository.add(user);
    }
}