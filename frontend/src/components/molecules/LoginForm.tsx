import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { login } from "../../services/auth";
import {
    FaTimesCircle,
    FaCheckCircle,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";
import { FaUnlockKeyhole } from "react-icons/fa6";
import { Modal } from "../atoms/Modal";

const validationSchema = yup.object({
    email: yup
        .string()
        .email("Debe ser un correo válido")
        .required("El correo es requerido"),
    password: yup
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .matches(/[A-Z]/, "La contraseña debe tener al menos una mayúscula")
        .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            "La contraseña debe tener al menos un carácter especial"
        )
        .required("La contraseña es requerida"),
});

export const LoginForm: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalIcon, setModalIcon] = useState<React.ReactNode | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                await login(values.email, values.password);
                setModalTitle("Éxito");
                setModalMessage("Inicio de sesión exitoso.");
                setModalIcon(
                    <FaCheckCircle className="w-12 h-12 text-sky-400 dark:text-white" />
                );
                setIsModalOpen(true);
                setIsSuccess(true);
            } catch (error) {
                console.log(error);
                setModalTitle("Error");
                setModalMessage(
                    "Error al iniciar sesión. Verifica tus credenciales."
                );
                setModalIcon(
                    <FaTimesCircle className="w-12 h-12 text-sky-400 dark:text-white" />
                );
                setIsModalOpen(true);
                setIsSuccess(false);
            }
        },
    });

    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (isSuccess) {
            window.location.href = "/dashboard";
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formik.isValid) {
            setModalTitle("Error");
            setModalMessage("Por favor, corrige los errores en el formulario.");
            setModalIcon(
                <FaTimesCircle className="w-12 h-12 text-sky-400 dark:text-white" />
            );
            setIsModalOpen(true);
        } else {
            formik.handleSubmit(e);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="px-8 py-4"
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    handleSubmit(e);
                }
            }}
        >
            <div>
                <Input
                    type="email"
                    placeholder="Correo electrónico"
                    label="Ingresa tu correo electrónico"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="email"
                    maxLength={100}
                />
                {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-sm mb-2">
                        {formik.errors.email}
                    </div>
                ) : null}
            </div>
            <div className="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    label="Ingresa tu contraseña"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="password"
                    maxLength={50}
                />
                <button
                    type="button"
                    className="absolute right-3 top-15 cursor-pointer text-gray-800 transform -translate-y-1/2 dark:text-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-500 text-sm mb-2">
                        {formik.errors.password}
                    </div>
                ) : null}
            </div>
            <Button type="submit" className="whitespace-nowrap">
                <FaUnlockKeyhole className="w-4 h-4 mr-2" />
                Iniciar Sesión
            </Button>
            <p className="pt-4 text-center text-sm font-light text-gray-500 dark:text-gray-400">
                ¿No tienes cuenta?
                <a
                    href="/register"
                    className="font-medium pl-2 text-sky-300 hover:underline dark:text-gray-300"
                >
                    Regístrate aquí
                </a>
            </p>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalTitle}
                message={modalMessage}
                icon={modalIcon}
            />
        </form>
    );
};
