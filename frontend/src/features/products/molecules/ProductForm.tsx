import React, { useState, useEffect } from "react";
import { Input } from "../../../components/atoms/Input";
import { Select } from "../../../components/atoms/Select";
import { Button } from "../../../components/atoms/Button";
import {
    FaCheckCircle,
    FaPlusCircle,
    FaTimesCircle,
    FaArrowRight,
} from "react-icons/fa";
import { createProduct } from "../../../services/products";
import { getCategories } from "../../../services/categories";
import { Link } from "react-router-dom";

interface Category {
    id: number;
    name: string;
    isActive?: boolean;
}

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
    const [categoryId, setCategoryId] = useState<number | "">("");
    const [price, setPrice] = useState<number | "">("");
    const [quantity, setQuantity] = useState<number | "">("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<{
        name?: string;
        category?: string;
        price?: string;
        quantity?: string;
    }>({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error fetching categories:", error);
                onShowModal(
                    "Error",
                    "No se pudieron cargar las categorías",
                    <FaTimesCircle className="w-12 h-12 text-red-500 dark:text-white" />
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, [onShowModal]);

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

        if (!categoryId) {
            newErrors.category = "La categoría es requerida.";
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
                Number(categoryId),
                Number(price),
                Number(quantity)
            );
            setName("");
            setCategoryId("");
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
            console.error("Error al actualizar el producto:", error);
            onShowModal(
                "Error",
                "Revisa si tu producto ya existe.",
                <FaTimesCircle className="w-12 h-12 text-red-500 dark:text-white" />
            );
        }
    };

    if (isLoading) {
        return (
            <div className="px-8 py-4 text-center">Cargando categorías...</div>
        );
    }

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
                {categories.filter((cat) => cat.isActive).length === 0 ? (
                    <div className="bg-gray-50 mb-2 mt-4 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        No hay categorías activas disponibles. Por favor, crea
                        una.
                    </div>
                ) : (
                    <Select
                        options={categories
                            .filter((cat) => cat.isActive)
                            .map((cat) => ({
                                value: cat.id,
                                label: cat.name,
                            }))}
                        value={categoryId}
                        onChange={(e) => setCategoryId(Number(e.target.value))}
                        name="category"
                        placeholder="Selecciona una categoría"
                    />
                )}
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <Link
                        to="/dashboard/categories"
                        className="text-sm text-gray-500 hover:underline hover:text-sky-400 dark:text-gray-400 dark:hover:text-white inline-flex items-center"
                    >
                        ¿No ves tu categoría? Agrégala aquí{" "}
                        <FaArrowRight className="ml-1" />
                    </Link>
                </div>
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
            <Button type="submit" className="w-full">
                <FaPlusCircle className="mr-2" /> Agregar producto
            </Button>
        </form>
    );
};
