import { CategoryController } from "./cotegory.controller";
import { CategoryService } from "../services/category.service";
import { CategoryRepository } from "../repositories/category.repository";

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

export { categoryController };
