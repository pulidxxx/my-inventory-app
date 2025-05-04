import { AppDataSource } from "../../../ormconfig";
import { User } from "../../../entities/User";
import { Repository } from "typeorm";

export class UserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.repository.findOne({ where: { email } });
    }

    async createUser(
        username: string,
        email: string,
        hashedPassword: string
    ): Promise<User> {
        const user = new User();
        user.username = username;
        user.email = email;
        user.password = hashedPassword;

        return this.repository.save(user);
    }
}
