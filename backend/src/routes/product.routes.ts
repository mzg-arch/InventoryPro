import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";

const router = Router();

router.get("/", authMiddleware, getProducts);
router.post("/", authMiddleware, createProduct);
router.get("/:id", authMiddleware, getProductById);
router.patch("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;