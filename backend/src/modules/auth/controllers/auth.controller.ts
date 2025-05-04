import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
    constructor(private authService: AuthService) {}

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { username, email, password } = req.body;

            const result = await this.authService.register(
                username,
                email,
                password
            );

            if (result.errors) {
                res.status(400).json({ errors: result.errors });
                return;
            }

            res.status(201).json({
                message: "User registered successfully",
                email: result.user?.email,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error registering user",
                error: (error as Error).message,
            });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            const result = await this.authService.login(email, password);

            if (result.errors) {
                res.status(400).json({ errors: result.errors });
                return;
            }

            if (!result.tokens) {
                res.status(401).json({ message: "Invalid credentials" });
                return;
            }

            res.json({
                accessToken: result.tokens.accessToken,
                refreshToken: result.tokens.refreshToken,
                username: result.tokens.username,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error logging in",
                error: (error as Error).message,
            });
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.body;

            if (!token) {
                res.status(401).json({ message: "Refresh token is required" });
                return;
            }

            const result = await this.authService.refreshToken(token);

            if (result.error) {
                res.status(403).json({ message: result.error });
                return;
            }

            res.json({ accessToken: result.accessToken });
        } catch (error) {
            res.status(500).json({
                message: "Error refreshing token",
                error: (error as Error).message,
            });
        }
    }
}
