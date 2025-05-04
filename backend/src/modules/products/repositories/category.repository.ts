import { AppDataSource } from "../../../ormconfig";
import { Category } from "../../../entities/Category";
import { Repository } from "typeorm";

export class CategoryRepository {
    private repository: Repository<Category>;

    constructor() {
        this.repository = AppDataSource.getRepository(Category);
    }

    async findOneById(id: number): Promise<Category | null> {
        return this.repository.findOne({ where: { id } });
    }
}
