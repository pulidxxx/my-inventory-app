import React from "react";
import { CategoryCard } from "../molecules/CategoryCard";
import { FaClipboardList, FaToggleOn, FaToggleOff } from "react-icons/fa";

interface Category {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
}

interface CategoryListProps {
    categories: Category[];
    onCategoryUpdated: () => void;
    onShowModal: (
        title: string,
        message: string,
        icon: React.ReactNode
    ) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
    categories,
    onCategoryUpdated,
    onShowModal,
}) => {
    const activeCategories = categories.filter((category) => category.isActive);
    const inactiveCategories = categories.filter(
        (category) => !category.isActive
    );

    return (
        <div className="space-y-6">
            {categories.length === 0 ? (
                <div className="flex flex-col items-center py-8">
                    <FaClipboardList className="w-12 h-12 text-sky-300 dark:text-white" />
                    <p className="text-center text-gray-500 mt-4">
                        No hay categorías disponibles. ¡Crea una para comenzar!
                    </p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        <h3 className="flex items-center mb-3 text-lg font-semibold text-gray-700 dark:text-white">
                            <FaToggleOn className="text-2xl mr-2 text-sky-300 dark:text-white" />
                            Categorías activas ({activeCategories.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 ">
                            {activeCategories.map((category) => (
                                <CategoryCard
                                    key={category.id}
                                    id={category.id}
                                    name={category.name}
                                    description={category.description}
                                    isActive={category.isActive}
                                    onCategoryUpdated={onCategoryUpdated}
                                    onShowModal={onShowModal}
                                />
                            ))}
                        </div>
                    </div>

                    {inactiveCategories.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="flex items-center mb-3 text-lg font-semibold text-gray-700 dark:text-white">
                                <FaToggleOff className="text-2xl mr-2 text-sky-300 dark:text-white" />
                                Categorías inactivas (
                                {inactiveCategories.length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                {inactiveCategories.map((category) => (
                                    <CategoryCard
                                        key={category.id}
                                        id={category.id}
                                        name={category.name}
                                        description={category.description}
                                        isActive={category.isActive}
                                        onCategoryUpdated={onCategoryUpdated}
                                        onShowModal={onShowModal}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
