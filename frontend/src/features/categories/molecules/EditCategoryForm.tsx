import React, { useState } from "react";
import { Input } from "../../../components/atoms/Input";
import { Button } from "../../../components/atoms/Button";
import { FaEdit } from "react-icons/fa";

interface EditCategoryFormProps {
    id: number;
    currentName: string;
    currentDescription: string;
    onCategoryUpdated: () => void;
    onClose: () => void;
    onEdit: (newName: string, newDescription: string) => void;
}

export const EditCategoryForm: React.FC<EditCategoryFormProps> = ({
    currentName,
    currentDescription,
    onCategoryUpdated,
    onClose,
    onEdit,
}) => {
    const [name, setName] = useState(currentName);
    const [description, setDescription] = useState(currentDescription);
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
        await onEdit(name, description);
        onCategoryUpdated();
        onClose();
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

            <div className="flex justify-end space-x-3">
                <Button type="submit">
                    <FaEdit className="mr-2" /> Actualizar Categoría
                </Button>
            </div>
        </form>
    );
};
