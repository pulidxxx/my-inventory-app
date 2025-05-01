import React, { useEffect } from "react";
import { Button } from "./Button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    icon,
    children,
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            id="popup-modal"
            tabIndex={-1}
            className="fixed inset-0 z-50 flex justify-center items-center w-full h-full"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            onClick={handleOutsideClick}
        >
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                        <span className="sr-only">Cerrar modal</span>
                    </button>

                    <div className="p-4 md:p-5 text-center">
                        {icon && (
                            <div className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200">
                                {icon}
                            </div>
                        )}

                        <h3
                            className={`mb-5 text-lg  ${
                                children
                                    ? " font-bold text-sky-300 md:text-2xl dark:text-white"
                                    : "font-bold text-sky-300 dark:text-white"
                            }`}
                        >
                            {title}
                        </h3>
                        <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                            {message}
                        </p>
                        {children}
                        {!children && <Button onClick={onClose}>OK</Button>}
                    </div>
                </div>
            </div>
        </div>
    );
};
