import React from "react";
import { FaBoxes } from "react-icons/fa";

interface AuthTemplateProps {
    children: React.ReactNode;
    title: string;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({
    children,
    title,
}) => (
    <section className="min-h-screen min-w-screen bg-sky-100/80 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <FaBoxes className="w-8 h-8 mr-2" />
                My inventory app
            </div>
            <div className="w-full bg-white rounded-lg  shadow-lg dark:shadow-md shadow-sky-200 dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-500">
                <div className="py-2 sm:pt-6">
                    <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-sky-300 md:text-2xl dark:text-white">
                        {title}
                    </h1>
                </div>
                <div>{children}</div>
            </div>
        </div>
    </section>
);
