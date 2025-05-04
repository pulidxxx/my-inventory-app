import { Category } from "../../../entities/Category";
import { CategoryRepository } from "../repositories/category.repository";
import { validateCategoryFields } from "../utils/category.validations";
import {
    CategoryCreateResult,
    CategoryUpdateResult,
    CategoryDeleteResult,
} from "../dtos/category.dtos";

export class CategoryService {
    constructor(private categoryRepository: CategoryRepository) {}

    async createCategory(
        name: string,
        description: string
    ): Promise<CategoryCreateResult> {
        const validationErrors = await validateCategoryFields(
            this.categoryRepository,
            name,
            description
        );

        if (validationErrors.length > 0) {
            return { errors: validationErrors };
        }

        const category = new Category();
        category.name = name;
        category.description = description;
        category.isActive = true;

        const savedCategory = await this.categoryRepository.save(category);
        return { category: savedCategory };
    }

    async getCategories(): Promise<Category[]> {
        return this.categoryRepository.findAll();
    }

    async updateCategory(
        id: number,
        name: string,
        description: string,
        isActive?: boolean
    ): Promise<CategoryUpdateResult> {
        const validationErrors = await validateCategoryFields(
            this.categoryRepository,
            name,
            description,
            id
        );

        if (validationErrors.length > 0) {
            return { errors: validationErrors };
        }

        const category = await this.categoryRepository.findOneById(id);
        if (!category) {
            return { notFound: true };
        }

        category.name = name;
        category.description = description;
        if (isActive !== undefined) {
            category.isActive = isActive;
        }

        const updatedCategory = await this.categoryRepository.save(category);
        return { category: updatedCategory };
    }

    async deleteCategory(id: number): Promise<CategoryDeleteResult> {
        const categoryWithProducts =
            await this.categoryRepository.findOneWithProducts(id);

        if (!categoryWithProducts) {
            return { notFound: true };
        }

        if (
            categoryWithProducts.products &&
            categoryWithProducts.products.length > 0
        ) {
            return { hasProducts: true };
        }

        await this.categoryRepository.delete(id);
        return {};
    }
}
