"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
exports.createProduct = createProduct;
exports.getProductById = getProductById;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const prisma_1 = __importDefault(require("../config/prisma"));
function hideUnownedSupplier(product, userId) {
    if (!product.supplier || product.supplier.userId === userId) {
        return product;
    }
    return {
        ...product,
        supplier: null,
    };
}
async function getProducts(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const products = await prisma_1.default.product.findMany({
            where: {
                userId,
            },
            include: {
                supplier: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const scopedProducts = products.map((product) => hideUnownedSupplier(product, userId));
        return res.status(200).json({
            message: "Products fetched successfully",
            count: scopedProducts.length,
            products: scopedProducts,
        });
    }
    catch (error) {
        console.error("Get products error:", error);
        return res.status(500).json({
            message: "Something went wrong while fetching products",
        });
    }
}
async function createProduct(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const { name, sku, category, quantity, price, minStock, description, supplierId, } = req.body;
        if (!name || !sku || !category || quantity === undefined || price === undefined) {
            return res.status(400).json({
                message: "Name, SKU, category, quantity, and price are required",
            });
        }
        const existingProduct = await prisma_1.default.product.findUnique({
            where: { sku },
        });
        if (existingProduct) {
            return res.status(409).json({
                message: "Product with this SKU already exists",
            });
        }
        if (supplierId) {
            const supplier = await prisma_1.default.supplier.findFirst({
                where: {
                    id: supplierId,
                    userId,
                },
            });
            if (!supplier) {
                return res.status(400).json({
                    message: "Supplier not found for this user",
                });
            }
        }
        const product = await prisma_1.default.product.create({
            data: {
                name,
                sku,
                category,
                quantity: Number(quantity),
                price: Number(price),
                minStock: minStock ? Number(minStock) : 5,
                description,
                userId,
                supplierId: supplierId || null,
            },
            include: {
                supplier: true,
            },
        });
        return res.status(201).json({
            message: "Product created successfully",
            product: hideUnownedSupplier(product, userId),
        });
    }
    catch (error) {
        console.error("Create product error:", error);
        return res.status(500).json({
            message: "Something went wrong while creating product",
        });
    }
}
async function getProductById(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const id = req.params.id;
        const product = await prisma_1.default.product.findFirst({
            where: {
                id,
                userId,
            },
            include: {
                supplier: true,
            },
        });
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        return res.status(200).json({
            message: "Product fetched successfully",
            product: hideUnownedSupplier(product, userId),
        });
    }
    catch (error) {
        console.error("Get product by ID error:", error);
        return res.status(500).json({
            message: "Something went wrong while fetching product",
        });
    }
}
async function updateProduct(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const id = req.params.id;
        const existingProduct = await prisma_1.default.product.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        const { name, sku, category, quantity, price, minStock, description, supplierId, } = req.body;
        const nextSupplierId = supplierId === undefined ? undefined : supplierId || null;
        if (nextSupplierId) {
            const supplier = await prisma_1.default.supplier.findFirst({
                where: {
                    id: nextSupplierId,
                    userId,
                },
            });
            if (!supplier) {
                return res.status(400).json({
                    message: "Supplier not found for this user",
                });
            }
        }
        const updatedProduct = await prisma_1.default.product.update({
            where: { id },
            data: {
                name,
                sku,
                category,
                quantity: quantity !== undefined ? Number(quantity) : undefined,
                price: price !== undefined ? Number(price) : undefined,
                minStock: minStock !== undefined ? Number(minStock) : undefined,
                description,
                supplierId: nextSupplierId,
            },
            include: {
                supplier: true,
            },
        });
        return res.status(200).json({
            message: "Product updated successfully",
            product: hideUnownedSupplier(updatedProduct, userId),
        });
    }
    catch (error) {
        console.error("Update product error:", error);
        return res.status(500).json({
            message: "Something went wrong while updating product",
        });
    }
}
async function deleteProduct(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const id = req.params.id;
        const existingProduct = await prisma_1.default.product.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        await prisma_1.default.product.delete({
            where: { id },
        });
        return res.status(200).json({
            message: "Product deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete product error:", error);
        return res.status(500).json({
            message: "Something went wrong while deleting product",
        });
    }
}
