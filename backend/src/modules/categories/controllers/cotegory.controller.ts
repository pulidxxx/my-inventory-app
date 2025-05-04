import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import {
    CategoryCreateResult,
    CategoryUpdateResult,
    CategoryDeleteResult,
} from "../dtos/category.dtos";

export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    async createCategory(req: Request, res: Response): Promise<void> {
        try {
            const { name, description } = req.body;

            const result: CategoryCreateResult =
                await this.categoryService.createCategory(name, description);

            if (result.errors) {
                res.status(400).json({ errors: result.errors });
                return;
            }

            res.status(201).json(result.category);
        } catch (error) {
            res.status(500).json({
                message: "Error creating category",
                error: (error as Error).message,
            });
        }
    }

    async getCategories(req: Request, res: Response): Promise<void> {
        try {
            const categories = await this.categoryService.getCategories();
            res.json(categories);
        } catch (error) {
            res.status(500).json({
                message: "Error fetching categories",
                error: (error as Error).message,
            });
        }
    }

    async updateCategory(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const { name, description, isActive } = req.body;

            const result: CategoryUpdateResult =
                await this.categoryService.updateCategory(
                    id,
                    name,
                    description,
                    isActive
                );

            if (result.notFound) {
                res.status(404).json({ message: "Category not found" });
                return;
            }

            if (result.errors) {
                res.status(400).json({ errors: result.errors });
                return;
            }

            res.json(result.category);
        } catch (error) {
            res.status(500).json({
                message: "Error updating category",
                error: (error as Error).message,
            });
        }
    }

    async deleteCategory(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);

            const result: CategoryDeleteResult =
                await this.categoryService.deleteCategory(id);

            if (result.notFound) {
                res.status(404).json({ message: "Category not found" });
                return;
            }

            if (result.hasProducts) {
                res.status(400).json({
                    message: "Cannot delete category with associated products",
                });
                return;
            }

            res.status(200).json({ message: "Category deleted successfully" });
        } catch (error) {
            res.status(500).json({
                message: "Error deleting category",
                error: (error as Error).message,
            });
        }
    }
}
