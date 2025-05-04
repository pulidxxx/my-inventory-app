import React, { useState } from "react";
import {
    FaTrash,
    FaEdit,
    FaCheckCircle,
    FaTimesCircle,
    FaUser,
} from "react-icons/fa";
import { deleteProduct, updateProduct } from "../../../services/products";
import { EditProductForm } from "./EditProductForm";
import { Modal } from "../../../components/atoms/Modal";

interface Category {
    id: number;
    name: string;
}

interface User {
    username: string;
    email: string;
}

interface ProductCardProps {
    id: number;
    name: string;
    price: string;
    quantity: number;
    category: Category;
    user: User;
    createdAt?: string;
    onProductUpdated: () => void;
    onShowModal: (
        title: string,
        message: string,
        icon: React.ReactNode
    ) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    price,
    quantity,
    category,
    user,
    onProductUpdated,
    onShowModal,
}) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await deleteProduct(id);
            onShowModal(
                "Éxito",
                "Producto eliminado correctamente.",
                <FaCheckCircle className="w-12 h-12 text-sky-400 dark:text-white" />
            );
            onProductUpdated();
        } catch (error) {
            console.error("Error eliminando el producto", error);
            onShowModal(
                "Error",
                "Error al eliminar el producto.",
                <FaTimesCircle className="w-12 h-12 text-red-500 dark:text-white" />
            );
        }
    };

    const handleEdit = async (
        newName: string,
        newCategoryId: number,
        newPrice: number,
        newQuantity: number
    ) => {
        try {
            await updateProduct(
                id,
                newName,
                newCategoryId,
                newPrice,
                newQuantity
            );
            onShowModal(
                "Éxito",
                "Producto actualizado correctamente.",
                <FaCheckCircle className="w-12 h-12 text-sky-400 dark:text-white" />
            );
            onProductUpdated();
        } catch (error) {
            console.error("Error actualizando el producto", error);
            onShowModal(
                "Error",
                "Error al actualizar el producto.",
                <FaTimesCircle className="w-12 h-12 text-red-500 dark:text-white" />
            );
        }
    };

    const handleOpenEditModal = () => {
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    return (
        <div className="relative m-2 p-4 border rounded-lg border-gray-200 hover:border-gray-400 hover:bg-gray-100 shadow-sm group dark:border-gray-600 dark:hover:border-gray-200 dark:hover:bg-gray-700">
            <div className="flex items-start">
                <div className="flex-grow min-w-0 break-words">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{name}</h3>
                        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-300">
                            <FaUser className="mr-1 text-sky-300 dark:text-gray-300" />
                            <span>
                                {user.username || user.email.split("@")[0]}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                Categoría
                            </p>
                            <p className="font-medium">{category.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                Precio
                            </p>
                            <p className="font-medium">{price}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                Cantidad
                            </p>
                            <p
                                className={`font-medium ${
                                    quantity <= 0 ? "text-red-500" : ""
                                }`}
                            >
                                {quantity}
                            </p>
                        </div>
                        {user.email && (
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-300">
                                    Creado por
                                </p>
                                <p
                                    className="font-medium text-sm truncate"
                                    title={user.email}
                                >
                                    {user.email}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center ml-2 absolute top-1/2 right-4 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleOpenEditModal}
                        className="text-gray-400 hover:text-sky-300 dark:hover:text-white p-1"
                        aria-label="Editar producto"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-gray-400 hover:text-sky-300 dark:hover:text-white p-1 ml-2"
                        aria-label="Eliminar producto"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>

            <Modal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                title="Editar Producto"
                message=""
            >
                <EditProductForm
                    id={id}
                    currentName={name}
                    currentCategoryId={category.id}
                    currentPrice={parseFloat(price.replace(/[^0-9.-]+/g, ""))}
                    currentQuantity={quantity}
                    onProductUpdated={onProductUpdated}
                    onClose={handleCloseEditModal}
                    onEdit={handleEdit}
                    onShowModal={onShowModal}
                />
            </Modal>
        </div>
    );
};
