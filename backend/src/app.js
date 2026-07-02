import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import productRoutes from "./routes/productRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = process.env.CLIENT_ORIGIN?.split(",").map((origin) => origin.trim());
app.use(cors({ origin: allowedOrigins?.length ? allowedOrigins : true }));
app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "100kb" }));

// API routes consumed by the Vite frontend.
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Smart Recommendation Engine Backend Running",
  });
});
app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));

// Error Handler
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Route ${req.originalUrl} not found`));
});
app.use(errorHandler);

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});

export default app;
