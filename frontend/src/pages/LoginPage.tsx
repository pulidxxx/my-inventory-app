import React from "react";
import { LoginForm } from "../components/molecules/LoginForm";
import { AuthTemplate } from "../components/templates/AuthTemplate";
import { ThemeToggle } from "../components/atoms/ThemeToggle";

export const LoginPage: React.FC = () => (
    <AuthTemplate title="Iniciar Sesión">
        <ThemeToggle />
        <LoginForm />
    </AuthTemplate>
);
