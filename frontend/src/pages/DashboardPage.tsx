import React, { useState, useEffect } from "react";
import { DashboardTemplate } from "../components/templates/DashboardTemplate";
import { ThemeToggle } from "../components/atoms/ThemeToggle";
import { getProducts } from "../services/products";

export const DashboardPage: React.FC = () => {
    const [products, setProducts] = useState<
        {
            id: number;
            name: string;
            category: string;
            price: number;
            quantity: number;
            createdAt: string;
        }[]
    >([]);

    const fetchProducts = async () => {
        const products = await getProducts();
        setProducts(products);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <>
            <ThemeToggle />
            <DashboardTemplate
                products={products}
                onAddProduct={fetchProducts}
                onDeleteProduct={fetchProducts}
            />
        </>
    );
};
