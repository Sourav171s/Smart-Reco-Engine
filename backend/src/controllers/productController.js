//firstly using the Product modal
import Product from "../models/Product.js"

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
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};