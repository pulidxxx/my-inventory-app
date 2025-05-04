import { AppDataSource } from "../../../ormconfig";
import { Category } from "../../../entities/Category";
import { Repository } from "typeorm";

export class CategoryRepository {
    private repository: Repository<Category>;

    constructor() {
        this.repository = AppDataSource.getRepository(Category);
    }

    async findOneByName(name: string): Promise<Category | null> {
        return this.repository.findOne({ where: { name } });
    }

    async findOneById(id: number): Promise<Category | null> {
        return this.repository.findOne({ where: { id } });
    }

    async findOneWithProducts(id: number): Promise<Category | null> {
        return this.repository.findOne({
            where: { id },
            relations: ["products"],
        });
    }

    async findAll(): Promise<Category[]> {
        return this.repository.find();
    }

    async save(category: Category): Promise<Category> {
        return this.repository.save(category);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
