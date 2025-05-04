import { ProductController } from "./product.controller";
import { ProductService } from "../services/product.service";
import { ProductRepository } from "../repositories/product.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { UserRepository } from "../../auth/repositories/user.repository";

const productRepository = new ProductRepository();
const categoryRepository = new CategoryRepository();
const userRepository = new UserRepository();
const productService = new ProductService(
    productRepository,
    categoryRepository,
    userRepository
);
const productController = new ProductController(productService);

export { productController };
