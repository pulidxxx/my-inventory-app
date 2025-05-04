import React, { useState } from "react";
import { Input } from "../../../components/atoms/Input";
import { Button } from "../../../components/atoms/Button";
import { FaPlusCircle, FaArrowLeft } from "react-icons/fa";
import { createCategory } from "../../../services/categories";
import { Link } from "react-router-dom";

interface CategoryFormProps {
    onCategoryCreated: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
    onCategoryCreated,
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState<{
        name?: string;
        description?: string;
    }>({});

    const validate = () => {
        const newErrors: { name?: string; description?: string } = {};

        if (!name || name.trim() === "") {
            newErrors.name = "El nombre es requerido.";
        } else if (name.length < 3 || name.length > 50) {
            newErrors.name = "El nombre debe tener entre 3 y 50 caracteres.";
        }

        if (!description || description.trim() === "") {
            newErrors.description = "La descripción es requerida.";
        } else if (description.length > 255) {
            newErrors.description =
                "La descripción no puede exceder 255 caracteres.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        await createCategory(name, description);
        setName("");
        setDescription("");
        setErrors({});
        onCategoryCreated();
    };

    return (
        <form onSubmit={handleSubmit} className="px-8 py-4 space-y-4">
            <div>
                <Input
                    type="text"
                    name="name"
                    placeholder="Nombre de la categoría"
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
                    name="description"
                    placeholder="Descripción de la categoría"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    isTextarea={true}
                />
                {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                    </p>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard/products" className="flex-1">
                    <Button type="button" className="w-full">
                        <FaArrowLeft className="mr-2" /> Volver a mi lista de
                        productos
                    </Button>
                </Link>
                <Button type="submit" className="flex-1">
                    <FaPlusCircle className="mr-2" /> Crear Categoría
                </Button>
            </div>
        </form>
    );
};
