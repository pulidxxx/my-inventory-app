import React, { useState } from "react";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { FaCheckCircle, FaPlusCircle, FaTimesCircle } from "react-icons/fa";
import { createProduct } from "../../services/products";

interface ProductFormProps {
    onProductCreated: () => void;
    onShowModal: (
        title: string,
        message: string,
        icon: React.ReactNode
    ) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
    onProductCreated,
    onShowModal,
}) => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState<number | "">("");
    const [quantity, setQuantity] = useState<number | "">("");
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
            await createProduct(
                name,
                category,
                Number(price),
                Number(quantity)
            );
            setName("");
            setCategory("");
            setPrice("");
            setQuantity("");
            setErrors({});
            onProductCreated();
            onShowModal(
                "Éxito",
                "Producto creado correctamente.",
                <FaCheckCircle className="w-12 h-12 text-sky-400 dark:text-white" />
            );
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Error al crear el producto.";
            onShowModal(
                "Error",
                errorMessage,
                <FaTimesCircle className="w-12 h-12 text-red-500 dark:text-white" />
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="px-8 py-4">
            <div>
                <Input
                    type="text"
                    name="name"
                    placeholder="Nombre del producto"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
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
                    <p className="text-red-500 text-sm">{errors.category}</p>
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
                    <p className="text-red-500 text-sm">{errors.price}</p>
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
                    <p className="text-red-500 text-sm">{errors.quantity}</p>
                )}
            </div>
            <Button type="submit">
                <FaPlusCircle className="mr-2" /> Agregar producto
            </Button>
        </form>
    );
};
