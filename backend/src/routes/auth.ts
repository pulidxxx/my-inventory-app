import express from "express";
import { authController } from "../modules/auth/controllers/auth.controller.index";

const router = express.Router();

router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/refresh-token", authController.refreshToken.bind(authController));

export default router;
