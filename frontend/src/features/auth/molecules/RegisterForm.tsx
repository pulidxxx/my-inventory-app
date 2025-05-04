import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Input } from "../../../components/atoms/Input";
import { Button } from "../../../components/atoms/Button";
import { register } from "../../../services/auth";
import {
    FaUserPlus,
    FaCheckCircle,
    FaTimesCircle,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";
import { Modal } from "../../../components/atoms/Modal";

const validationSchema = yup.object({
    username: yup
        .string()
        .max(20, "El usuario no puede tener más de 20 caracteres")
        .required("El usuario es requerido"),
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
    confirmPassword: yup
        .string()
        .oneOf(
            [yup.ref("password"), undefined],
            "Las contraseñas deben coincidir"
        )
        .required("La confirmación de la contraseña es requerida"),
});

export const RegisterForm: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalIcon, setModalIcon] = useState<React.ReactNode | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                await register(values.username, values.email, values.password);
                setModalTitle("Éxito");
                setModalMessage("Usuario registrado correctamente.");
                setModalIcon(
                    <FaCheckCircle className="w-12 h-12 text-sky-400 dark:text-white" />
                );
                setIsModalOpen(true);
                setIsSuccess(true);
            } catch (error) {
                console.log(error);
                setModalTitle("Error");
                setModalMessage("Error al registrar usuario.");
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
            window.location.href = "/login";
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
                    type="text"
                    placeholder="Usuario"
                    label="Ingresa tu usuario"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="username"
                    maxLength={20}
                />
                {formik.touched.username && formik.errors.username ? (
                    <div className="text-red-500 text-sm mb-2">
                        {formik.errors.username}
                    </div>
                ) : null}
            </div>
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
            <div className="relative">
                <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmar contraseña"
                    label="Confirma tu contraseña"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="confirmPassword"
                    maxLength={50}
                />
                <button
                    type="button"
                    className="absolute right-3 top-15 cursor-pointer text-gray-800 transform -translate-y-1/2 dark:text-gray-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                    <div className="text-red-500 text-sm mb-2">
                        {formik.errors.confirmPassword}
                    </div>
                ) : null}
            </div>
            <Button type="submit" className="whitespace-nowrap mt-8">
                <FaUserPlus className="w-4 h-4 mr-2" />
                Registrar usuario
            </Button>
            <p className="pt-4 text-center text-sm font-light text-gray-500 dark:text-gray-400">
                ¿Ya tienes cuenta?
                <a
                    href="/login"
                    className="font-medium pl-2 text-sky-300 hover:underline dark:text-gray-300"
                >
                    Ingrese aquí
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
