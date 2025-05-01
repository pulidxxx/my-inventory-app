import React, { useState } from "react";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { FaCheckCircle, FaEdit, FaTimesCircle } from "react-icons/fa";

interface EditProductFormProps {
    id: number;
    currentName: string;
    currentCategory: string;
    currentPrice: number;
    currentQuantity: number;
    onProductUpdated: () => void;
    onClose: () => void;
    onEdit: (
        newName: string,
        newCategory: string,
        newPrice: number,
        newQuantity: number
    ) => void;
    onShowModal: (
        title: string,
        message: string,
        icon: React.ReactNode
    ) => void;
}

export const EditProductForm: React.FC<EditProductFormProps> = ({
    currentName,
    currentCategory,
    currentPrice,
    currentQuantity,
    onProductUpdated,
    onClose,
    onEdit,
    onShowModal,
}) => {
    const [name, setName] = useState(currentName);
    const [category, setCategory] = useState(currentCategory);
    const [price, setPrice] = useState<number | "">(currentPrice);
    const [quantity, setQuantity] = useState<number | "">(currentQuantity);
    const [errors, setErrors] = useState<{
        name?: string;
        category?: string;
        price?: string;
        quantity?: string;
    }>({});

    const validate = () => {
        const newErrors: {
            name?: string;
            category?: string;
            price?: string;
            quantity?: string;
        } = {};

        if (!name || name.trim() === "") {
            newErrors.name = "El nombre es requerido.";
        } else if (name.length < 3 || name.length > 50) {
            newErrors.name = "El nombre debe tener entre 3 y 50 caracteres.";
        }

        if (!category || category.trim() === "") {
            newErrors.category = "La categoría es requerida.";
        } else if (category.length < 3 || category.length > 50) {
            newErrors.category =
                "La categoría debe tener entre 3 y 50 caracteres.";
        }

        if (price === "" || price === null || price === undefined) {
            newErrors.price = "El precio es requerido.";
        } else if (Number(price) <= 0) {
            newErrors.price = "El precio debe ser mayor que 0.";
        }

        if (quantity === "" || quantity === null || quantity === undefined) {
            newErrors.quantity = "La cantidad es requerida.";
        } else if (Number(quantity) < 0) {
            newErrors.quantity = "La cantidad no puede ser negativa.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await onEdit(name, category, Number(price), Number(quantity));
            onShowModal(
                "Éxito",
                "Producto actualizado correctamente.",
                <FaCheckCircle className="w-12 h-12 text-sky-400 dark:text-white" />
            );
            onProductUpdated();
            onClose();
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Error al actualizar el producto.";
            console.error("Error al actualizar el producto:", error);
            onShowModal(
                "Error",
                errorMessage,
                <FaTimesCircle className="w-12 h-12 text-red-500 dark:text-white" />
            );
        }
    };
    return (
        <form onSubmit={handleSubmit} className="px-8 py-4 space-y-4">
            <div>
                <Input
                    type="text"
                    name="name"
                    placeholder="Nombre del producto"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
            </div>
            <div>
                <Input
                    type="text"
                    name="category"
                    placeholder="Categoría"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                {errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.category}
                    </p>
                )}
            </div>
            <div>
                <Input
                    type="number"
                    name="price"
                    placeholder="Precio"
                    value={price === "" ? "" : String(price)}
                    onChange={(e) =>
                        setPrice(
                            e.target.value === "" ? "" : Number(e.target.value)
                        )
                    }
                />
                {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
            </div>
            <div>
                <Input
                    type="number"
                    name="quantity"
                    placeholder="Cantidad"
                    value={quantity === "" ? "" : String(quantity)}
                    onChange={(e) =>
                        setQuantity(
                            e.target.value === "" ? "" : Number(e.target.value)
                        )
                    }
                />
                {errors.quantity && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.quantity}
                    </p>
                )}
            </div>
            <div className="flex justify-end space-x-3">
                <Button type="submit" className="px-4 py-2">
                    <FaEdit className="mr-2" /> Actualizar Producto
                </Button>
            </div>
        </form>
    );
};
