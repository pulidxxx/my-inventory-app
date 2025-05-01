import React, { useState } from "react";
import { FaTrash, FaEdit, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { deleteProduct, updateProduct } from "../../services/products";
import { EditProductForm } from "./EditProductForm";
import { Modal } from "../atoms/Modal";

interface ProductCardProps {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
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
    category,
    price,
    quantity,
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
            console.log("Error eliminando el producto", error);
            onShowModal(
                "Error",
                "Error al eliminar el producto.",
                <FaTimesCircle className="w-12 h-12 text-sky-400 dark:text-white" />
            );
        }
    };

    const handleEdit = async (
        newName: string,
        newCategory: string,
        newPrice: number,
        newQuantity: number
    ) => {
        await updateProduct(id, newName, newCategory, newPrice, newQuantity);
        onProductUpdated();
    };

    const handleOpenEditModal = () => {
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    const formattedPrice = price.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <div className="relative m-4 p-4 border rounded-lg border-gray-200 hover:border-gray-400 hover:bg-gray-100 shadow-sm group dark:border-gray-600 dark:hover:border-gray-200 dark:hover:bg-gray-700">
            <div className="flex items-start">
                <div className="flex-grow min-w-0 break-words">
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                Categoría
                            </p>
                            <p className="font-medium">{category}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                Precio
                            </p>
                            <p className="font-medium">{formattedPrice}</p>
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
                    </div>
                </div>
                <div className="flex items-center ml-2 mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleOpenEditModal}
                        className="text-gray-400 hover:text-sky-300 dark:hover:text-white p-1"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-gray-400 hover:text-sky-300 dark:hover:text-white p-1 ml-2"
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
                    currentCategory={category}
                    currentPrice={price}
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
