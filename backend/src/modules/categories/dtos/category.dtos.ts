import { Category } from "../../../entities/Category";

export interface CategoryCreateResult {
    category?: Category;
    errors?: string[];
}

export interface CategoryUpdateResult {
    category?: Category;
    errors?: string[];
    notFound?: boolean;
}

export interface CategoryDeleteResult {
    notFound?: boolean;
    hasProducts?: boolean;
}

export interface CategoryCreateDTO {
    name: string;
    description: string;
}

export interface CategoryUpdateDTO {
    name: string;
    description: string;
    isActive?: boolean;
}
