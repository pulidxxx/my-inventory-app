import axios from "axios";
import { refreshToken } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "api/v1/products";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshToken();
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("username");
                window.dispatchEvent(new Event("sessionExpired"));
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

interface Category {
    id: number;
    name: string;
}

interface User {
    username: string;
    email: string;
}

export interface Product {
    id: number;
    name: string;
    price: string;
    quantity: number;
    category: Category;
    user: User;
    createdAt: string;
}

export const getProducts = async (): Promise<Product[]> => {
    const response = await axiosInstance.get(API_BASE_URL);
    return response.data.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        category: {
            id: product.category.id,
            name: product.category.name,
        },
        user: {
            username: product.user.username,
            email: product.user.email,
        },
        createdAt: product.createdAt,
    }));
};

export const createProduct = async (
    name: string,
    categoryId: number,
    price: number,
    quantity: number
): Promise<Product> => {
    try {
        const response = await axiosInstance.post(API_BASE_URL, {
            name,
            categoryId,
            price,
            quantity,
        });
        return {
            ...response.data,
            category: {
                id: response.data.category.id,
                name: response.data.category.name,
            },
            user: {
                username: response.data.user.username,
                email: response.data.user.email,
            },
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data) {
            throw new Error(
                error.response.data.message || "Error al crear el producto."
            );
        }
        throw new Error("Error de red o del servidor.");
    }
};

export const updateProduct = async (
    id: number,
    name: string,
    categoryId: number,
    price: number,
    quantity: number
): Promise<Product> => {
    try {
        const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, {
            name,
            categoryId,
            price,
            quantity,
        });
        return {
            ...response.data,
            category: {
                id: response.data.category.id,
                name: response.data.category.name,
            },
            user: {
                username: response.data.user.username,
                email: response.data.user.email,
            },
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data) {
            throw new Error(
                error.response.data.message || "Error al actualizar el producto"
            );
        }
        throw new Error("Error de red o del servidor");
    }
};

export const deleteProduct = async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_BASE_URL}/${id}`);
};
