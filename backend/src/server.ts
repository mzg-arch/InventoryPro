import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import { authMiddleware, AuthRequest } from "./middleware/auth.middleware";
dotenv.config();
import productRoutes from "./routes/product.routes";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("InventoryPro API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);


app.get("/api/protected", authMiddleware, (req: AuthRequest, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});