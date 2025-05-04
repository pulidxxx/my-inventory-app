import { AppDataSource } from "../../../ormconfig";
import { Product } from "../../../entities/Product";
import { Repository } from "typeorm";

export class ProductRepository {
    private repository: Repository<Product>;

    constructor() {
        this.repository = AppDataSource.getRepository(Product);
    }

    async findOneByName(name: string): Promise<Product | null> {
        return this.repository.findOne({ where: { name } });
    }

    async findOneById(id: number): Promise<Product | null> {
        return this.repository.findOne({
            where: { id },
            relations: ["category", "user"],
        });
    }

    async findAllByUser(userEmail: string): Promise<Product[]> {
        return this.repository.find({
            where: { user: { email: userEmail } },
            relations: ["category"],
        });
    }

    async save(product: Product): Promise<Product> {
        return this.repository.save(product);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    async findAllWithUser(): Promise<Product[]> {
        return this.repository.find({
            relations: ["category", "user"],
            select: {
                user: {
                    username: true,
                    email: true,
                },
                category: {
                    id: true,
                    name: true,
                },
            },
        });
    }
}
