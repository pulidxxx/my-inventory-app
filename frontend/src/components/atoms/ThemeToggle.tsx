import React, { useEffect, useState } from "react";

export const ThemeToggle: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        if (isDarkMode) {
            document.body.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme === "dark") {
            setIsDarkMode(true);
        } else {
            setIsDarkMode(false);
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <label className="inline-flex items-center cursor-pointer fixed bottom-4 right-4 z-50">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={isDarkMode}
                onChange={toggleTheme}
            />
            <div className="relative w-11 h-6 bg-sky-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-sky-400 dark:text-gray-300">
                {isDarkMode ? "Modo oscuro" : "Modo claro"}
            </span>
        </label>
    );
};
