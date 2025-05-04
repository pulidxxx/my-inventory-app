import { Product } from "../../../entities/Product";
import { ProductRepository } from "../repositories/product.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { UserRepository } from "../../auth/repositories/user.repository";
import { validateProductFields } from "../utils/product.validations";
import { ProductWithUserDto } from "../dtos/product.dto";
interface ProductResult {
    product?: Product;
    errors?: string[];
    notFound?: string;
}

export class ProductService {
    constructor(
        private productRepository: ProductRepository,
        private categoryRepository: CategoryRepository,
        private userRepository: UserRepository
    ) {}

    async getProducts(): Promise<ProductWithUserDto[]> {
        const products = await this.productRepository.findAllWithUser();

        return products.map(
            (product) =>
                new ProductWithUserDto(
                    product.id,
                    product.name,
                    product.price,
                    product.quantity,
                    {
                        id: product.category.id,
                        name: product.category.name,
                    },
                    {
                        username: product.user.username,
                        email: product.user.email,
                    }
                )
        );
    }

    async createProduct(
        name: string,
        categoryId: number,
        price: number,
        quantity: number,
        userEmail: string
    ): Promise<ProductResult> {
        const validationErrors = await validateProductFields(
            name,
            categoryId,
            price,
            quantity
        );

        if (validationErrors.length > 0) {
            return { errors: validationErrors };
        }

        const user = await this.userRepository.findOneByEmail(userEmail);
        if (!user) {
            return { notFound: "User not found" };
        }

        const category = await this.categoryRepository.findOneById(categoryId);
        if (!category) {
            return { notFound: "Category not found" };
        }

        const product = new Product();
        product.name = name;
        product.category = category;
        product.price = price;
        product.quantity = quantity;
        product.user = user;

        const savedProduct = await this.productRepository.save(product);
        return { product: savedProduct };
    }

    async updateProduct(
        id: number,
        name: string,
        categoryId: number,
        price: number,
        quantity: number,
        userEmail: string
    ): Promise<ProductResult> {
        const validationErrors = await validateProductFields(
            name,
            categoryId,
            price,
            quantity,
            id
        );

        if (validationErrors.length > 0) {
            return { errors: validationErrors };
        }

        const category = await this.categoryRepository.findOneById(categoryId);
        if (!category) {
            return { notFound: "Category not found" };
        }

        const product = await this.productRepository.findOneById(id, userEmail);
        if (!product) {
            return { notFound: "Product not found or not owned by user" };
        }

        product.name = name;
        product.category = category;
        product.price = price;
        product.quantity = quantity;

        const updatedProduct = await this.productRepository.save(product);
        return { product: updatedProduct };
    }

    async deleteProduct(
        id: number,
        userEmail: string
    ): Promise<{ notFound?: string }> {
        const product = await this.productRepository.findOneById(id, userEmail);
        if (!product) {
            return { notFound: "Product not found or not owned by user" };
        }

        await this.productRepository.delete(id);
        return {};
    }
}
