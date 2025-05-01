import { Request, Response } from "express";
import { AppDataSource } from "../../ormconfig";
import { User } from "../../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userRepository = AppDataSource.getRepository(User);

const generateAccessToken = (email: string) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_ACCESS_EXPIRATION;
    if (!secret) {
        throw new Error(
            "JWT_SECRET is not defined in the environment variables."
        );
    }
    if (!expiresIn) {
        throw new Error(
            "JWT_ACCESS_EXPIRATION is not defined in the environment variables."
        );
    }
    return jwt.sign({ email }, secret, {
        expiresIn: parseInt(expiresIn, 10),
    });
};

const generateRefreshToken = (email: string) => {
    const secret = process.env.JWT_REFRESH_SECRET;
    const expiresIn = process.env.JWT_REFRESH_EXPIRATION;
    if (!secret) {
        throw new Error(
            "JWT_REFRESH_SECRET is not defined in the environment variables."
        );
    }
    if (!expiresIn) {
        throw new Error(
            "JWT_REFRESH_EXPIRATION is not defined in the environment variables."
        );
    }
    return jwt.sign({ email }, secret, {
        expiresIn: parseInt(expiresIn, 10),
    });
};

const validateRegisterFields = (
    username: string,
    email: string,
    password: string
) => {
    const errors: string[] = [];

    if (!username || username.length > 20) {
        errors.push(
            "The username cannot exceed 20 characters and is required."
        );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push("Must be a valid email.");
    }

    if (!password || password.length < 8) {
        errors.push("The password must be at least 8 characters long.");
    }

    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) {
        errors.push("The password must have at least one uppercase letter.");
    }

    const specialCharRegex = /[!@#$%^+&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(password)) {
        errors.push("The password must have at least one special character.");
    }

    return errors;
};

const validateLoginFields = (email: string, password: string) => {
    const errors: string[] = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push("Must be a valid email.");
    }

    if (!password || password.length < 8) {
        errors.push("The password must be at least 8 characters long.");
    }

    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) {
        errors.push("The password must have at least one uppercase letter.");
    }

    const specialCharRegex = /[!@#$%^+&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(password)) {
        errors.push("The password must have at least one special character.");
    }

    return errors;
};

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        const validationErrors = validateRegisterFields(
            username,
            email,
            password
        );
        if (validationErrors.length > 0) {
            res.status(400).json({ errors: validationErrors });
            return;
        }

        const existingUser = await userRepository.findOne({
            where: { email },
        });

        if (existingUser) {
            res.status(400).send("Error registering user");
            return;
        }

        const newUser = new User();
        newUser.username = username;
        newUser.email = email;
        newUser.password = await bcrypt.hash(password, 10);

        await userRepository.save(newUser);
        res.status(201).send("User registered successfully");
    } catch (error) {
        res.status(500).send("Error registering user");
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const validationErrors = validateLoginFields(email, password);
        if (validationErrors.length > 0) {
            res.status(400).json({ errors: validationErrors });
            return;
        }

        const user = await userRepository.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(400).send("Invalid credentials");
            return;
        }

        const accessToken = generateAccessToken(user.email);
        const refreshToken = generateRefreshToken(user.email);

        res.send({ accessToken, refreshToken, username: user.username });
    } catch (error) {
        res.status(500).send("Error logging in");
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token) {
        res.status(401).send("Refresh token is required");
        return;
    }

    try {
        const secret = process.env.JWT_REFRESH_SECRET;
        if (!secret) {
            throw new Error(
                "JWT_REFRESH_SECRET is not defined in the environment variables."
            );
        }

        const decoded = jwt.verify(token, secret) as unknown as {
            email: string;
        };
        const accessToken = generateAccessToken(decoded.email);
        res.send({ accessToken });
    } catch (error) {
        res.status(403).send("Invalid refresh, please login again");
    }
};
