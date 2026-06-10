import { Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export async function getSuppliers(req: AuthRequest, res: Response) {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        products: true,
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
  } catch (error) {
    console.error("Get suppliers error:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching suppliers",
    });
  }
}

export async function createSupplier(req: AuthRequest, res: Response) {
  try {
    const { name, email, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Supplier name is required",
      });
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        email,
        phone,
        address,
      },
    });

    return res.status(201).json({
      message: "Supplier created successfully",
      supplier,
    });
  } catch (error) {
    console.error("Create supplier error:", error);

    return res.status(500).json({
      message: "Something went wrong while creating supplier",
    });
  }
}

export async function getSupplierById(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;

    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        products: true,
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
  } catch (error) {
    console.error("Get supplier by ID error:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching supplier",
    });
  }
}

export async function updateSupplier(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const { name, email, phone, address } = req.body;

    const existingSupplier = await prisma.supplier.findUnique({
      where: { id },
    });

    if (!existingSupplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    const updatedSupplier = await prisma.supplier.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
      },
    });

    return res.status(200).json({
      message: "Supplier updated successfully",
      supplier: updatedSupplier,
    });
  } catch (error) {
    console.error("Update supplier error:", error);

    return res.status(500).json({
      message: "Something went wrong while updating supplier",
    });
  }
}

export async function deleteSupplier(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;

    const existingSupplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        products: true,
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

    await prisma.supplier.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    console.error("Delete supplier error:", error);

    return res.status(500).json({
      message: "Something went wrong while deleting supplier",
    });
  }
}