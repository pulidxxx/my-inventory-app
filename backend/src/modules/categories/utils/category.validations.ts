import { CategoryRepository } from "../repositories/category.repository";

export async function validateCategoryFields(
    categoryRepository: CategoryRepository,
    name: string,
    description: string,
    categoryId?: number
): Promise<string[]> {
    const errors: string[] = [];

    if (!name || name.trim() === "") {
        errors.push("The name field is required.");
    } else if (name.length < 3 || name.length > 50) {
        errors.push("The name must be between 3 and 50 characters long.");
    } else {
        const existingCategory = await categoryRepository.findOneByName(name);
        if (existingCategory && existingCategory.id !== categoryId) {
            errors.push("A category with this name already exists.");
        }
    }

    if (!description || description.trim() === "") {
        errors.push("The description field is required.");
    } else if (description.length > 255) {
        errors.push("The description cannot exceed 255 characters.");
    }

    return errors;
}
