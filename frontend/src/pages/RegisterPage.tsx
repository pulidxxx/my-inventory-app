import React from "react";
import { RegisterForm } from "../features/auth/molecules/RegisterForm";
import { AuthTemplate } from "../features/auth/templates/AuthTemplate";
import { ThemeToggle } from "../components/atoms/ThemeToggle";

export const RegisterPage: React.FC = () => (
    <div className="flex justify-center items-center h-screen">
        <AuthTemplate title="Registrar usuario">
            <ThemeToggle />
            <RegisterForm />
        </AuthTemplate>
    </div>
);
