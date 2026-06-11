import { Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export async function getDashboardStats(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const products = await prisma.product.findMany({
      where: {
        userId,
      },
    });

    const totalProducts = products.length;

    const totalSuppliers = await prisma.supplier.count({
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
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching dashboard stats",
    });
  }
}
