import express from "express";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../modules/products/product.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getProducts);
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
