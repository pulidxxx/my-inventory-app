import React, { useState } from "react";
import { FaTrash, FaEdit, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { deleteCategory, updateCategory } from "../../../services/categories";
import { Modal } from "../../../components/atoms/Modal";
import { EditCategoryForm } from "../molecules/EditCategoryForm";

interface CategoryCardProps {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    onCategoryUpdated: () => void;
    onShowModal: (
        title: string,
        message: string,
        icon: React.ReactNode
    ) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
    id,
    name,
    description,
    isActive,
    onCategoryUpdated,
    onShowModal,
}) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(isActive);

    const handleToggleActive = async () => {
        try {
            await updateCategory(id, name, description, !isChecked);
            setIsChecked(!isChecked);
            onCategoryUpdated();
            onShowModal(
                "Éxito",
                `La categoría ha sido ${
                    !isChecked ? "activada" : "desactivada"
                } correctamente.`,
                <FaCheckCircle className="w-12 h-12 text-sky-400 dark:text-white" />
            );
        } catch (error) {
            console.error("Error al actualizar la categoría", error);
            onShowModal(
                "Error",
                "No se pudo actualizar el estado de la categoría.",
                <FaTimesCircle className="w-12 h-12 text-red-500 dark:text-white" />
            );
        }
    };

    const handleDelete = async () => {
        try {
            await deleteCategory(id);
            onShowModal(
                "Éxito",
                "Categoría eliminada correctamente.",
                <FaCheckCircle className="w-12 h-12 text-sky-400 dark:text-white" />
            );
            onCategoryUpdated();
        } catch (error) {
            console.error("Error al eliminar la categoría", error);
            onShowModal(
                "Error",
                "No se pudo eliminar la categoría.",
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

    const handleEdit = async (newName: string, newDescription: string) => {
        try {
            await updateCategory(id, newName, newDescription, isChecked);
            onShowModal(
                "Éxito",
                "Categoría editada correctamente.",
                <FaCheckCircle className="w-12 h-12 text-sky-400 dark:text-white" />
            );
            onCategoryUpdated();
        } catch (error) {
            console.error("Error al editar la categoría", error);
            onShowModal(
                "Error",
                "No se pudo editar la categoría, revisa que el nombre no este repetido.",
                <FaTimesCircle className="w-12 h-12 text-red-500 dark:text-white" />
            );
        } finally {
            setIsEditModalOpen(false);
        }
    };

    return (
        <div className="relative m-2 p-4 border rounded-lg border-gray-200 hover:border-gray-400 hover:bg-gray-100 shadow-sm group dark:border-gray-600 dark:hover:border-gray-200 dark:hover:bg-gray-700">
            <div className="flex items-start">
                <div className="flex items-center h-full mx-2 mt-1">
                    <button
                        onClick={handleToggleActive}
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            isChecked
                                ? "bg-green-500 text-white border border-green-500"
                                : "bg-gray-300 text-gray-700"
                        }`}
                    >
                        {isChecked && <FaCheckCircle className="w-3 h-3" />}
                    </button>
                </div>

                <div className="flex-grow min-w-0 break-words">
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                        {description}
                    </p>
                    <p
                        className={`mt-2 text-sm font-medium ${
                            isChecked ? "text-green-500" : "text-red-500"
                        }`}
                    >
                        {isChecked ? "Activo" : "Inactivo"}
                    </p>
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
                title="Editar Categoría"
                message=""
            >
                <EditCategoryForm
                    id={id}
                    currentName={name}
                    currentDescription={description}
                    onCategoryUpdated={onCategoryUpdated}
                    onClose={handleCloseEditModal}
                    onEdit={handleEdit}
                />
            </Modal>
        </div>
    );
};
