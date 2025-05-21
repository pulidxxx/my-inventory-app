import axios from "axios";
import { refreshToken } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "api/v1/categories";

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

export const getCategories = async () => {
    const response = await axiosInstance.get(API_BASE_URL);
    return response.data;
};

export const createCategory = async (
    name: string,
    description: string,
    isActive: boolean = true
) => {
    const response = await axiosInstance.post(API_BASE_URL, {
        name,
        description,
        isActive,
    });
    return response.data;
};

export const updateCategory = async (
    id: number,
    name: string,
    description: string,
    isActive: boolean
) => {
    const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, {
        name,
        description,
        isActive,
    });
    return response.data;
};

export const deleteCategory = async (id: number) => {
    const response = await axiosInstance.delete(`${API_BASE_URL}/${id}`);
    return response.data;
};
