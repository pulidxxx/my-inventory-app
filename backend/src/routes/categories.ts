import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { categoryController } from "../modules/categories/controllers/category.controller.index";

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    categoryController.getCategories.bind(categoryController)
);
router.post(
    "/",
    authMiddleware,
    categoryController.createCategory.bind(categoryController)
);
router.put(
    "/:id",
    authMiddleware,
    categoryController.updateCategory.bind(categoryController)
);
router.delete(
    "/:id",
    authMiddleware,
    categoryController.deleteCategory.bind(categoryController)
);

export default router;
