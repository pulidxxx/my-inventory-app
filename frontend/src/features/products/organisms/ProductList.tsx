import React from "react";
import { ProductCard } from "../molecules/ProductCard";
import { FaBoxOpen, FaBoxes, FaExclamationTriangle } from "react-icons/fa";

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
    price: number;
    quantity: number;
    category: Category;
    user: User;
    createdAt?: string;
}

interface ProductListProps {
    products: Product[];
    onProductUpdated: () => void;
    onShowModal: (
        title: string,
        message: string,
        icon: React.ReactNode
    ) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
    products,
    onProductUpdated,
    onShowModal,
}) => {
    const productsInStock = products.filter((product) => product.quantity > 0);
    const outOfStockProducts = products.filter(
        (product) => product.quantity <= 0
    );

    return (
        <div className="space-y-6">
            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                    <FaBoxOpen className="w-12 h-12 text-sky-300 dark:text-white" />
                    <p className="text-center text-gray-500 mt-4">
                        No hay productos registrados. ¡Agrega uno para comenzar!
                    </p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        <h3 className="flex items-center mb-3 text-lg font-semibold text-gray-700 dark:text-white">
                            <FaBoxes className="text-md mr-2 text-sky-300 dark:text-white" />
                            Disponibles ({productsInStock.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {productsInStock.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    price={product.price.toString()}
                                    quantity={product.quantity}
                                    category={product.category}
                                    user={product.user}
                                    onProductUpdated={onProductUpdated}
                                    onShowModal={onShowModal}
                                />
                            ))}
                        </div>
                    </div>

                    {outOfStockProducts.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="flex items-center mb-3 text-lg font-semibold text-gray-700 dark:text-white">
                                <FaExclamationTriangle className="text-md mr-2 text-sky-300 dark:text-white" />
                                Agotados ({outOfStockProducts.length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                {outOfStockProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        price={product.price.toString()}
                                        quantity={product.quantity}
                                        category={product.category}
                                        user={product.user}
                                        onProductUpdated={onProductUpdated}
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
