"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuppliers = getSuppliers;
exports.createSupplier = createSupplier;
exports.getSupplierById = getSupplierById;
exports.updateSupplier = updateSupplier;
exports.deleteSupplier = deleteSupplier;
const prisma_1 = __importDefault(require("../config/prisma"));
async function getSuppliers(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const suppliers = await prisma_1.default.supplier.findMany({
            where: {
                userId,
            },
            include: {
                products: {
                    where: {
                        userId,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            message: "Suppliers fetched successfully",
            count: suppliers.length,
            suppliers,
        });
    }
    catch (error) {
        console.error("Get suppliers error:", error);
        return res.status(500).json({
            message: "Something went wrong while fetching suppliers",
        });
    }
}
async function createSupplier(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const { name, email, phone, address } = req.body;
        if (!name) {
            return res.status(400).json({
                message: "Supplier name is required",
            });
        }
        const supplier = await prisma_1.default.supplier.create({
            data: {
                name,
                email,
                phone,
                address,
                userId,
            },
            include: {
                products: {
                    where: {
                        userId,
                    },
                },
            },
        });
        return res.status(201).json({
            message: "Supplier created successfully",
            supplier,
        });
    }
    catch (error) {
        console.error("Create supplier error:", error);
        return res.status(500).json({
            message: "Something went wrong while creating supplier",
        });
    }
}
async function getSupplierById(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const id = req.params.id;
        const supplier = await prisma_1.default.supplier.findFirst({
            where: {
                id,
                userId,
            },
            include: {
                products: {
                    where: {
                        userId,
                    },
                },
            },
        });
        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found",
            });
        }
        return res.status(200).json({
            message: "Supplier fetched successfully",
            supplier,
        });
    }
    catch (error) {
        console.error("Get supplier by ID error:", error);
        return res.status(500).json({
            message: "Something went wrong while fetching supplier",
        });
    }
}
async function updateSupplier(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const id = req.params.id;
        const existingSupplier = await prisma_1.default.supplier.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!existingSupplier) {
            return res.status(404).json({
                message: "Supplier not found",
            });
        }
        const { name, email, phone, address } = req.body;
        const updatedSupplier = await prisma_1.default.supplier.update({
            where: { id },
            data: {
                name,
                email,
                phone,
                address,
            },
            include: {
                products: {
                    where: {
                        userId,
                    },
                },
            },
        });
        return res.status(200).json({
            message: "Supplier updated successfully",
            supplier: updatedSupplier,
        });
    }
    catch (error) {
        console.error("Update supplier error:", error);
        return res.status(500).json({
            message: "Something went wrong while updating supplier",
        });
    }
}
async function deleteSupplier(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const id = req.params.id;
        const existingSupplier = await prisma_1.default.supplier.findFirst({
            where: {
                id,
                userId,
            },
            include: {
                products: {
                    where: {
                        userId,
                    },
                },
            },
        });
        if (!existingSupplier) {
            return res.status(404).json({
                message: "Supplier not found",
            });
        }
        if (existingSupplier.products.length > 0) {
            return res.status(400).json({
                message: "Cannot delete supplier because it has products linked to it",
            });
        }
        await prisma_1.default.supplier.delete({
            where: { id },
        });
        return res.status(200).json({
            message: "Supplier deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete supplier error:", error);
        return res.status(500).json({
            message: "Something went wrong while deleting supplier",
        });
    }
}
