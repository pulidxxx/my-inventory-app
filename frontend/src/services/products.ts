import axios from "axios";
import { refreshToken } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/products";

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

export const getProducts = async () => {
    const response = await axiosInstance.get(API_BASE_URL);
    return response.data;
};

export const createProduct = async (
    name: string,
    category: string,
    price: number,
    quantity: number
) => {
    try {
        const response = await axiosInstance.post(API_BASE_URL, {
            name,
            category,
            price,
            quantity,
        });
        return response.data;
    } catch (error: unknown) {
        if (
            axios.isAxiosError(error) &&
            error.response &&
            error.response.data
        ) {
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
    category: string,
    price: number,
    quantity: number
) => {
    try {
        const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, {
            name,
            category,
            price,
            quantity,
        });
        return response.data;
    } catch (error: unknown) {
        if (
            axios.isAxiosError(error) &&
            error.response &&
            error.response.data
        ) {
            throw new Error(
                error.response.data.message || "Error al actualizar el producto"
            );
        }
        throw new Error("Error de red o del servidor");
    }
};

export const deleteProduct = async (id: number) => {
    await axiosInstance.delete(`${API_BASE_URL}/${id}`);
};
