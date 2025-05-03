import React, { useState } from "react";
import { ProductForm } from "../molecules/ProductForm";
import { ProductList } from "../organisms/ProductList";
import {
    FaBoxes,
    FaUser,
    FaSignOutAlt,
    FaFilter,
    FaSearch,
} from "react-icons/fa";
import { Modal } from "../atoms/Modal";

interface DashboardTemplateProps {
    products: {
        id: number;
        name: string;
        category: string;
        price: number;
        quantity: number;
        createdAt: string;
    }[];
    onAddProduct: () => void;
    onDeleteProduct: () => void;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
    products,
    onAddProduct,
    onDeleteProduct,
}) => {
    const username = localStorage.getItem("username");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalIcon, setModalIcon] = useState<React.ReactNode | null>(null);
    const [sortBy, setSortBy] = useState<
        "name" | "price" | "quantity" | "date"
    >("date");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const handleShowModal = (
        title: string,
        message: string,
        icon: React.ReactNode
    ) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalIcon(icon);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        window.location.href = "/login";
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(event.target.value as "name" | "price" | "quantity" | "date");
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleCategoryChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedCategory(event.target.value);
    };

    const categories = [
        "all",
        ...Array.from(new Set(products.map((p) => p.category.toLowerCase()))),
    ];

    const filteredProducts = products
        .filter(
            (product) =>
                product.name.toLowerCase().includes(searchTerm) &&
                (selectedCategory === "all" ||
                    product.category.toLowerCase() === selectedCategory)
        )
        .sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "price") return a.price - b.price;
            if (sortBy === "quantity") return a.quantity - b.quantity;
            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
        });

    const productsInStock = filteredProducts.filter((p) => p.quantity > 0);
    const outOfStockProducts = filteredProducts.filter((p) => p.quantity <= 0);

    return (
        <section className="min-h-screen bg-sky-100/80 dark:bg-gray-900 dark:text-white">
            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex items-end justify-between mb-6">
                    <p className="flex text-sky-300 items-center text-2xl font-bold dark:text-white">
                        <FaBoxes className="mr-2" /> My Inventory App
                    </p>
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-lg font-bold cursor-pointer hover:text-sky-400 dark:hover:text-white transition-colors"
                    >
                        Cerrar sesión <FaSignOutAlt className="mx-2" />
                    </button>
                </div>
                <div className="flex items-end justify-between mb-6">
                    <button
                        type="button"
                        className="flex items-center text-md font-bold text-gray-500 dark:text-gray-300"
                    >
                        <FaUser className="mr-2" /> {username}
                    </button>
                </div>

                <div className="w-full bg-white rounded-lg shadow-lg dark:shadow-md shadow-sky-200 dark:border dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-500">
                    <div className="py-2 sm:pt-6">
                        <h1 className="flex items-center justify-center text-xl font-bold leading-tight tracking-tight text-sky-300 md:text-2xl dark:text-white">
                            Agrega un producto
                        </h1>
                    </div>
                    <ProductForm
                        onProductCreated={onAddProduct}
                        onShowModal={handleShowModal}
                    />
                </div>

                <div className="mt-10 p-6 w-full bg-white rounded-lg shadow-lg dark:shadow-md shadow-sky-200 dark:border dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-500">
                    <div className="mb-6">
                        <h2 className="flex items-center text-xl font-semibold text-sky-300 dark:text-white mb-4">
                            <FaBoxes className="text-2xl mr-2 text-sky-300 dark:text-white" />
                            Inventario de productos
                        </h2>

                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-3 text-sm text-sky-300 dark:text-white" />
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full text-sm py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-2 pr-2 pl-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300"
                                />
                            </div>

                            <div className="relative flex-1">
                                <select
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    className="w-full text-sm py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-3 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-300"
                                >
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category === "all"
                                                ? "Todas categorías"
                                                : category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative flex-1">
                                <FaFilter className="absolute left-3 top-3 text-sm text-sky-300 dark:text-white" />
                                <select
                                    value={sortBy}
                                    onChange={handleSortChange}
                                    className="w-full text-sm py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-2 pr-2 pl-8 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-300"
                                >
                                    <option value="date">
                                        Más recientes primero
                                    </option>
                                    <option value="name">
                                        Ordenar por nombre
                                    </option>
                                    <option value="price">
                                        Ordenar por precio
                                    </option>
                                    <option value="quantity">
                                        Ordenar por cantidad
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                            <div className="text-sm bg-green-100 text-green-800 py-2 px-4 rounded-lg border border-green-400 whitespace-nowrap">
                                En stock: {productsInStock.length}
                            </div>
                            <div className="text-sm bg-red-100 text-red-800 py-2 px-4 rounded-lg border border-red-400 whitespace-nowrap">
                                Agotados: {outOfStockProducts.length}
                            </div>
                        </div>
                    </div>

                    <ProductList
                        products={filteredProducts}
                        onProductUpdated={onDeleteProduct}
                        onShowModal={handleShowModal}
                    />
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalTitle}
                message={modalMessage}
                icon={modalIcon}
            />
        </section>
    );
};
