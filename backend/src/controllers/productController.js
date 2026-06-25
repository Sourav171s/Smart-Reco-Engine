//firstly using the Product modal
import Product from "../models/Product.js"
import Inventory from "../models/Inventory.js";
import Recommendation from "../models/Recommendation.js";

//Create Product on->  POST /api/products
export const createProduct = async (req,res,next) =>{
    try {
        const product = await Product.create(req.body);         //in json format
        res.status(201).json({
            success: true,
            message: "Product created Successfully",
            data: product
        });

    } catch (error) {
        next(error)
    }
};

//Get all products
export const getProducts= async (req,res,next) => {
    try {
        const products= await Product.find().sort({
            createdAt: -1                                             //to get the newer products first
        });
        res.status(200).json({
            success: true,
            count : products.length,
            data:products,
        });
    } catch (error) {
        next(error);
    }
};

//Get single product
//GET /api/products/:id
export const getProductById = async (req,res,next) => {
    try {
        const product= await Product.findById(req.params.id);

        if(!product){
            res.status(404);
            throw new Error("Product not found");
        }

        res.status(200).json({
            success: true,
            data: product,
        });

    } catch (error) {
        next(error);
    }
};


//Update Product
//PUT /api/products/:id
export const updateProduct = async (req,res,next) => {
    try {
        const product= await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true, // return updated document
                runValidators: true, // apply schema validations
            }
        );

        if(!product){
            res.status(404);
            throw new Error("Product not found");
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

// DELETE PRODUCT
// DELETE /api/products/:id
// =====================================================
// DELETE PRODUCT
// DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;

    // 1. Delete the product itself
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // 2. CASCADE DELETE: Clean up orphaned records
    // This ensures no "ghost" data exists for a deleted product
    
    // Delete related inventory record
    await Inventory.deleteMany({ productId: productId });
    
    // Delete all recommendations where this product was either the source or the target
    await Recommendation.deleteMany({
      $or: [
        { sourceProductId: productId },
        { recommendedProductId: productId }
      ]
    });

    res.status(200).json({
      success: true,
      message: "Product and all related inventory/recommendation records deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};