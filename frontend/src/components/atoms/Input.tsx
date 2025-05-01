import React from "react";

interface InputProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    onBlur?: (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    name: string;
    maxLength?: number;
    icon?: React.ReactNode;
    className?: string;
    label?: string;
    isTextarea?: boolean;
}

export const Input: React.FC<InputProps> = ({
    type,
    placeholder,
    value,
    onChange,
    onBlur,
    name,
    maxLength,
    className,
    label,
    isTextarea = false,
}) => (
    <div className={`relative ${className}`}>
        {label && (
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {label}
            </label>
        )}
        {isTextarea ? (
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                maxLength={maxLength}
                className={`bg-gray-50 mb-8 mt-4 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize`}
                rows={4}
            />
        ) : (
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                maxLength={maxLength}
                className={`bg-gray-50 mb-2 mt-4 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            />
        )}
    </div>
);
