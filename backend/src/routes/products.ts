import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { productController } from "../modules/products/controllers/product.controller.index";

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    productController.getProducts.bind(productController)
);
router.post(
    "/",
    authMiddleware,
    productController.createProduct.bind(productController)
);
router.put(
    "/:id",
    authMiddleware,
    productController.updateProduct.bind(productController)
);
router.delete(
    "/:id",
    authMiddleware,
    productController.deleteProduct.bind(productController)
);

export default router;
