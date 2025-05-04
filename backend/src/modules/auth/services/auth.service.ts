import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/user.repository";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/token.utils";
import jwt from "jsonwebtoken";
import {
    validateRegisterFields,
    validateLoginFields,
} from "../utils/auth.validations";
import {
    RegisterResult,
    LoginResult,
    RefreshTokenResult,
} from "../dtos/auth.dtos";

export class AuthService {
    constructor(private userRepository: UserRepository) {}

    async register(
        username: string,
        email: string,
        password: string
    ): Promise<RegisterResult> {
        const errors = validateRegisterFields(username, email, password);
        if (errors.length > 0) {
            return { errors };
        }

        email = email.toLowerCase();

        const existingUser = await this.userRepository.findOneByEmail(email);
        if (existingUser) {
            return { errors: ["Error registering user"] };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userRepository.createUser(
            username,
            email,
            hashedPassword
        );

        return { user: { email: user.email } };
    }

    async login(email: string, password: string): Promise<LoginResult> {
        const errors = validateLoginFields(email, password);
        if (errors.length > 0) {
            return { errors };
        }
        email = email.toLowerCase();
        const user = await this.userRepository.findOneByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return { errors: ["Invalid credentials"] };
        }

        const accessToken = generateAccessToken(user.email);
        const refreshToken = generateRefreshToken(user.email);

        return {
            tokens: {
                accessToken,
                refreshToken,
                username: user.username,
            },
        };
    }

    async refreshToken(token: string): Promise<RefreshTokenResult> {
        try {
            const secret = process.env.JWT_REFRESH_SECRET;
            if (!secret) {
                throw new Error("JWT_REFRESH_SECRET is not defined");
            }

            const decoded = jwt.verify(token, secret) as { email: string };
            const accessToken = generateAccessToken(decoded.email);

            return { accessToken };
        } catch (error) {
            return { error: "Invalid refresh token" };
        }
    }
}
