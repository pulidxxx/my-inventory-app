import React from "react";

interface SelectProps {
    options: { value: string | number; label: string }[];
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    name: string;
    className?: string;
    label?: string;
    placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    name,
    className,
    label,
    placeholder,
}) => (
    <div className={`relative ${className}`}>
        {label && (
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {label}
            </label>
        )}
        <select
            value={value}
            onChange={onChange}
            name={name}
            className="bg-gray-50 mb-2 mt-4 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
            {placeholder && (
                <option value="" disabled>
                    {placeholder}
                </option>
            )}
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);
