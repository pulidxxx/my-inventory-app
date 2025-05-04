import React, { useState, useEffect } from "react";
import { DashboardProductTemplate } from "../features/products/templates/DashboardProductTemplate";
import { ThemeToggle } from "../components/atoms/ThemeToggle";
import { getProducts } from "../services/products";

interface Category {
    id: number;
    name: string;
}

interface User {
    username: string;
    email: string;
}

interface Product {
    id: number;
    name: string;
    category: Category;
    price: number;
    quantity: number;
    user: User;
    createdAt: string;
}

export const DashboardProductPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    const fetchProducts = async () => {
        const products = (await getProducts()).map((product) => ({
            ...product,
            price: parseFloat(product.price),
        }));
        setProducts(products);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <>
            <ThemeToggle />
            <DashboardProductTemplate
                products={products}
                onAddProduct={fetchProducts}
                onDeleteProduct={fetchProducts}
            />
        </>
    );
};
