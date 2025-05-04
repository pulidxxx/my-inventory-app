import React from "react";
import { LoginForm } from "../features/auth/molecules/LoginForm";
import { AuthTemplate } from "../features/auth/templates/AuthTemplate";
import { ThemeToggle } from "../components/atoms/ThemeToggle";

export const LoginPage: React.FC = () => (
    <AuthTemplate title="Iniciar Sesión">
        <ThemeToggle />
        <LoginForm />
    </AuthTemplate>
);
