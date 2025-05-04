export interface RegisterResult {
    errors?: string[];
    user?: {
        email: string;
    };
}

export interface LoginResult {
    errors?: string[];
    tokens?: {
        accessToken: string;
        refreshToken: string;
        username: string;
    };
}

export interface RefreshTokenResult {
    accessToken?: string;
    error?: string;
}

export interface RegisterDTO {
    username: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface RefreshTokenDTO {
    token: string;
}
