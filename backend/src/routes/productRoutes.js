import express from "express";
import prisma from "../prismaClient.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route - get all products
router.get("/", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// Admin routes
router.post("/", authenticate, isAdmin, async (req, res) => {
  const { name, description, price, image } = req.body;
  const product = await prisma.product.create({
    data: { name, description, price: parseFloat(price), image },
  });
  res.json(product);
});

router.put("/:id", authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image } = req.body;

  const updated = await prisma.product.update({
    where: { id: parseInt(id) },
    data: { name, description, price: parseFloat(price), image },
  });

  res.json(updated);
});

router.delete("/:id", authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id: parseInt(id) } });
  res.json({ message: "Product deleted" });
});

export default router;