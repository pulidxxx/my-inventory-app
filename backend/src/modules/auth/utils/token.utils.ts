import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = (email: string): string => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_ACCESS_EXPIRATION;

    if (!secret || !expiresIn) {
        throw new Error("JWT configuration is missing");
    }

    return jwt.sign({ email }, secret, {
        expiresIn: parseInt(expiresIn, 10),
    });
};

export const generateRefreshToken = (email: string): string => {
    const secret = process.env.JWT_REFRESH_SECRET;
    const expiresIn = process.env.JWT_REFRESH_EXPIRATION;

    if (!secret || !expiresIn) {
        throw new Error("JWT refresh configuration is missing");
    }

    return jwt.sign({ email }, secret, {
        expiresIn: parseInt(expiresIn, 10),
    });
};
