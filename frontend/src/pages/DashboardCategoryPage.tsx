import React, { useState, useEffect } from "react";
import { DashboardCategoryTemplate } from "../features/categories/templates/DashboardCategoryTemplate";
import { ThemeToggle } from "../components/atoms/ThemeToggle";
import { getCategories } from "../services/categories";

export const DashboardCategoryPage: React.FC = () => {
    const [categories, setCategories] = useState<
        {
            id: number;
            name: string;
            description: string;
            isActive: boolean;
            createdAt: string;
        }[]
    >([]);

    const fetchCategories = async () => {
        try {
            const categoriesData = await getCategories();
            setCategories(categoriesData);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <>
            <ThemeToggle />
            <DashboardCategoryTemplate
                categories={categories}
                onAddCategory={fetchCategories}
                onDeleteCategory={fetchCategories}
            />
        </>
    );
};
