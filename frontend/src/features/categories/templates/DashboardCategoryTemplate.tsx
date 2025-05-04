import React, { useState } from "react";
import { CategoryForm } from "../molecules/CategoryForm";
import { CategoryList } from "../organisms/CategoryList";
import {
    FaUser,
    FaSignOutAlt,
    FaClipboardList,
    FaFilter,
    FaBoxes,
    FaSearch,
} from "react-icons/fa";
import { Modal } from "../../../components/atoms/Modal";

interface DashboardCategoryTemplateProps {
    categories: {
        id: number;
        name: string;
        description: string;
        isActive: boolean;
        createdAt: string;
    }[];
    onAddCategory: () => void;
    onDeleteCategory: () => void;
}

export const DashboardCategoryTemplate: React.FC<
    DashboardCategoryTemplateProps
> = ({ categories, onAddCategory, onDeleteCategory }) => {
    const username = localStorage.getItem("username");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalIcon, setModalIcon] = useState<React.ReactNode | null>(null);
    const [sortOption, setSortOption] = useState<
        "name-asc" | "name-desc" | "date-asc" | "date-desc"
    >("name-asc");
    const [searchTerm, setSearchTerm] = useState("");

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
        setSortOption(
            event.target.value as
                | "name-asc"
                | "name-desc"
                | "date-asc"
                | "date-desc"
        );
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const sortedCategories = [...categories]
        .filter(
            (category) =>
                category.name.toLowerCase().includes(searchTerm) ||
                category.description.toLowerCase().includes(searchTerm)
        )
        .sort((a, b) => {
            switch (sortOption) {
                case "name-asc":
                    return a.name.localeCompare(b.name);
                case "name-desc":
                    return b.name.localeCompare(a.name);
                case "date-asc":
                    return (
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    );
                case "date-desc":
                    return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    );
                default:
                    return 0;
            }
        });

    const activeCategories = sortedCategories.filter(
        (category) => category.isActive
    );
    const inactiveCategories = sortedCategories.filter(
        (category) => !category.isActive
    );

    return (
        <section className="min-h-screen min-w-screen bg-sky-100/80 dark:bg-gray-900 dark:text-white">
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
                            Agrega una categoría
                        </h1>
                    </div>
                    <CategoryForm onCategoryCreated={onAddCategory} />
                </div>
                <div className="mt-10 p-6 w-full bg-white rounded-lg shadow-lg dark:shadow-md shadow-sky-200 dark:border dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-500">
                    <div className="mb-6">
                        <h2 className="flex items-center text-xl font-semibold text-sky-300 dark:text-white mb-4">
                            <FaClipboardList className="text-2xl mr-2 text-sky-300 dark:text-white" />
                            Lista de categorías
                        </h2>

                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-3 text-sm text-sky-300 dark:text-white" />
                                <input
                                    type="text"
                                    placeholder="Buscar categorías..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full text-sm py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-2 pr-2 pl-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300"
                                />
                            </div>

                            <div className="relative flex-1">
                                <FaFilter className="absolute left-3 top-3 text-sm text-sky-300 dark:text-white" />
                                <select
                                    value={sortOption}
                                    onChange={handleSortChange}
                                    className="w-full text-sm py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-2 pr-2 pl-8 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-300"
                                >
                                    <option value="name-asc">
                                        Nombre (A-Z)
                                    </option>
                                    <option value="name-desc">
                                        Nombre (Z-A)
                                    </option>
                                    <option value="date-desc">
                                        Fecha (más reciente)
                                    </option>
                                    <option value="date-asc">
                                        Fecha (más antigua)
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                            <div className="text-sm bg-green-100 text-green-800 py-2 px-4 rounded-lg border border-green-400 whitespace-nowrap">
                                Activas: {activeCategories.length}
                            </div>
                            {inactiveCategories.length > 0 && (
                                <div className="text-sm bg-red-100 text-red-800 py-2 px-4 rounded-lg border border-red-400 whitespace-nowrap">
                                    Inactivas: {inactiveCategories.length}
                                </div>
                            )}
                        </div>
                    </div>
                    <CategoryList
                        categories={sortedCategories}
                        onCategoryUpdated={onDeleteCategory}
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
