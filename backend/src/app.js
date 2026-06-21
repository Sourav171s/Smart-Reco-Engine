import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

connectDB();

const app = express();                //Creates the Express "app" object and Think of this as the engine of your server.

// Middleware
app.use(cors());
app.use(express.json());

//for products
app.use("/api/products",productRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Smart Recommendation Engine Backend Running",
  });
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});