import express from "express";

import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// for /api/products

router.route("/")
    .post(createProduct)
    .get(getProducts);

// for /api/products/:id

router.route("/:id")
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct)

export default router;