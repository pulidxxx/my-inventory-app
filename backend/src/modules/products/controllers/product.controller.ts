import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { ProductWithUserDto } from "../dtos/product.dto";
export class ProductController {
    constructor(private productService: ProductService) {}

    async getProducts(req: Request, res: Response): Promise<void> {
        try {
            const products = await this.productService.getProducts();
            res.json(products);
        } catch (error) {
            res.status(500).json({
                message: "Error fetching products",
                error: (error as Error).message,
            });
        }
    }
    async createProduct(req: Request, res: Response): Promise<void> {
        try {
            const { name, categoryId, price, quantity } = req.body;
            const userEmail = (req as any).user.email;

            const result = await this.productService.createProduct(
                name,
                categoryId,
                price,
                quantity,
                userEmail
            );

            if (result.errors) {
                res.status(400).json({ errors: result.errors });
                return;
            }

            if (result.notFound) {
                res.status(404).json({ message: result.notFound });
                return;
            }

            res.status(201).json(result.product);
        } catch (error) {
            res.status(500).json({
                message: "Error creating product",
                error: (error as Error).message,
            });
        }
    }

    async updateProduct(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { name, categoryId, price, quantity } = req.body;
            const userEmail = (req as any).user.email;

            const result = await this.productService.updateProduct(
                parseInt(id),
                name,
                categoryId,
                price,
                quantity,
                userEmail
            );

            if (result.errors) {
                res.status(400).json({ errors: result.errors });
                return;
            }

            if (result.notFound) {
                res.status(404).json({ message: result.notFound });
                return;
            }

            res.json(result.product);
        } catch (error) {
            res.status(500).json({
                message: "Error updating product",
                error: (error as Error).message,
            });
        }
    }

    async deleteProduct(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userEmail = (req as any).user.email;

            const result = await this.productService.deleteProduct(
                parseInt(id),
                userEmail
            );

            if (result.notFound) {
                res.status(404).json({ message: result.notFound });
                return;
            }

            res.status(204).send();
        } catch (error) {
            res.status(500).json({
                message: "Error deleting product",
                error: (error as Error).message,
            });
        }
    }
}
