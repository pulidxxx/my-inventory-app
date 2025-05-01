import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { Modal } from "./components/atoms/Modal";

const App: React.FC = () => {
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme === "dark") {
            document.body.setAttribute("data-theme", "dark");
        } else {
            document.body.setAttribute("data-theme", "light");
        }
    }, []);

    useEffect(() => {
        const handleSessionExpired = () => {
            setIsSessionExpired(true);
        };

        window.addEventListener("sessionExpired", handleSessionExpired);

        return () => {
            window.removeEventListener("sessionExpired", handleSessionExpired);
        };
    }, []);

    const handleCloseModal = () => {
        setIsSessionExpired(false);
        window.location.href = "/login";
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/dashboard"
                    element={
                        localStorage.getItem("accessToken") ? (
                            <DashboardPage />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
            <Modal
                isOpen={isSessionExpired}
                onClose={handleCloseModal}
                title="Sesión expirada"
                message="Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
            />
        </Router>
    );
};

export default App;
