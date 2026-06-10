import { Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export async function getProducts(req: AuthRequest, res: Response) {
  try {
    const products = await prisma.product.findMany({
      where: {
        userId: req.user?.userId,
      },
      include: {
        supplier: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Products fetched successfully",
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching products",
    });
  }
}

export async function createProduct(req: AuthRequest, res: Response) {
  try {
    const {
      name,
      sku,
      category,
      quantity,
      price,
      minStock,
      description,
      supplierId,
    } = req.body;

    if (!name || !sku || !category || quantity === undefined || price === undefined) {
      return res.status(400).json({
        message: "Name, SKU, category, quantity, and price are required",
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { sku },
    });

    if (existingProduct) {
      return res.status(409).json({
        message: "Product with this SKU already exists",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        category,
        quantity: Number(quantity),
        price: Number(price),
        minStock: minStock ? Number(minStock) : 5,
        description,
        userId: req.user?.userId as string,
        supplierId: supplierId || null,
      },
      include: {
        supplier: true,
      },
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      message: "Something went wrong while creating product",
    });
  }
}

export async function getProductById(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;

    const product = await prisma.product.findFirst({
      where: {
        id,
        userId: req.user?.userId,
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
      product,
    });
  } catch (error) {
    console.error("Get product by ID error:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching product",
    });
  }
}

export async function updateProduct(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;

    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        userId: req.user?.userId,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const {
      name,
      sku,
      category,
      quantity,
      price,
      minStock,
      description,
      supplierId,
    } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        sku,
        category,
        quantity: quantity !== undefined ? Number(quantity) : undefined,
        price: price !== undefined ? Number(price) : undefined,
        minStock: minStock !== undefined ? Number(minStock) : undefined,
        description,
        supplierId: supplierId || null,
      },
      include: {
        supplier: true,
      },
    });

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      message: "Something went wrong while updating product",
    });
  }
}

export async function deleteProduct(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;

    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        userId: req.user?.userId,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await prisma.product.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      message: "Something went wrong while deleting product",
    });
  }
}