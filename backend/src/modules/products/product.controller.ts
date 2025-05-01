import { Request, Response } from "express";
import { AppDataSource } from "../../ormconfig";
import { Product } from "../../entities/Product";

const productRepository = AppDataSource.getRepository(Product);

const validateProductFields = async (
    name: string,
    category: string,
    price: number,
    quantity: number,
    productId?: number
) => {
    const errors: string[] = [];

    if (!name || name.trim() === "") {
        errors.push("The name field is required.");
    } else if (name.length < 3 || name.length > 50) {
        errors.push("The name must be between 3 and 50 characters long.");
    } else {
        const existingProduct = await productRepository.findOne({
            where: { name },
        });
        if (existingProduct && existingProduct.id !== productId) {
            errors.push("A product with this name already exists.");
        }
    }

    if (!category || category.trim() === "") {
        errors.push("The category field is required.");
    } else if (category.length < 3 || category.length > 50) {
        errors.push("The category must be between 3 and 50 characters long.");
    }

    if (price === undefined || price === null) {
        errors.push("The price field is required.");
    } else if (price <= 0) {
        errors.push("The price must be greater than 0.");
    }

    if (quantity === undefined || quantity === null) {
        errors.push("The quantity field is required.");
    } else if (quantity < 0) {
        errors.push("The quantity cannot be negative.");
    }

    return errors;
};

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await productRepository.find({
            where: { user: { email: (req as any).user.email } },
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching products",
            error: (error as Error).message,
        });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, category, price, quantity } = req.body;

        const validationErrors = await validateProductFields(
            name,
            category,
            price,
            quantity
        );
        if (validationErrors.length > 0) {
            res.status(400).json({ errors: validationErrors });
            return;
        }

        const product = new Product();
        product.name = name;
        product.category = category;
        product.price = price;
        product.quantity = quantity;
        product.user = (req as any).user.email;

        await productRepository.save(product);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({
            message: "Error creating product",
            error: (error as Error).message,
        });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, category, price, quantity } = req.body;

        const validationErrors = await validateProductFields(
            name,
            category,
            price,
            quantity,
            parseInt(id)
        );
        if (validationErrors.length > 0) {
            res.status(400).json({ errors: validationErrors });
            return;
        }

        const product = await productRepository.findOne({
            where: {
                id: parseInt(id),
                user: { email: (req as any).user.email },
            },
        });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        product.name = name;
        product.category = category;
        product.price = price;
        product.quantity = quantity;

        await productRepository.save(product);
        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: "Error updating product",
            error: (error as Error).message,
        });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const product = await productRepository.findOne({
            where: {
                id: parseInt(id),
                user: { email: (req as any).user.email },
            },
        });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        await productRepository.delete(id);
        res.status(200).json({
            message: `Product with id ${id} has been deleted`,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting product",
            error: (error as Error).message,
        });
    }
};
