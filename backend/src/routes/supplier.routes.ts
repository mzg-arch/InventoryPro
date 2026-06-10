import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createSupplier,
  deleteSupplier,
  getSupplierById,
  getSuppliers,
  updateSupplier,
} from "../controllers/supplier.controller";

const router = Router();

router.get("/", authMiddleware, getSuppliers);
router.post("/", authMiddleware, createSupplier);
router.get("/:id", authMiddleware, getSupplierById);
router.patch("/:id", authMiddleware, updateSupplier);
router.delete("/:id", authMiddleware, deleteSupplier);

export default router;