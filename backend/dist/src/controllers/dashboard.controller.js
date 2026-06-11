"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = getDashboardStats;
const prisma_1 = __importDefault(require("../config/prisma"));
async function getDashboardStats(req, res) {
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
        });
        const totalProducts = products.length;
        const totalSuppliers = await prisma_1.default.supplier.count({
            where: {
                userId,
            },
        });
        const lowStockProducts = products.filter((product) => {
            return product.quantity <= product.minStock;
        }).length;
        const totalInventoryValue = products.reduce((total, product) => {
            return total + product.quantity * product.price;
        }, 0);
        const totalStockQuantity = products.reduce((total, product) => {
            return total + product.quantity;
        }, 0);
        return res.status(200).json({
            message: "Dashboard stats fetched successfully",
            stats: {
                totalProducts,
                totalSuppliers,
                lowStockProducts,
                totalInventoryValue,
                totalStockQuantity,
            },
        });
    }
    catch (error) {
        console.error("Dashboard stats error:", error);
        return res.status(500).json({
            message: "Something went wrong while fetching dashboard stats",
        });
    }
}
