import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";

//for creating an initial record for the inventory of the proj.
// POST /api/inventory
export const createInventory = async (req,res,next) => {
    try {
        const {productId,availableQuantity} = req.body;

        //for checking does the product already exists or not
        const product = await Product.findById(productId);

        if (!product) {
            res.status(404);
            throw new Error("Product not found");
        }

        const existingInventory = await Inventory.findOne({productId});
        if(existingInventory){
            res.status(400)
            throw new Error("Inventory record already exists for this project. Use put to update stock");
        }

        const inventory= await Inventory.create({productId,availableQuantity});
        //Fetch the newly created record fresh from the database 
        // with the populated data. This ensures 100% data integrity.
        const populatedInventory = await Inventory.findById(inventory._id).populate("productId");

        res.status(201).json({
            success : true,
            message: "Inventory record created successfully",
            data : populatedInventory,
        })
    } catch (error) {
        next(error);
    }
};


//Getting all inventory records
// GET /api/inventory
export const getInventory = async (req,res,next) => {
    try {
        const inventoryList = await Inventory.find()
            .populate("productId")
            .sort({updatedAt : -1});

        res.status(200).json({
            success: true,
            count:inventoryList.length,
            data : inventoryList,
        });


    } catch (error) {
        next(error);
    }
}


//getting single inventory item by id
// GET /api/inventory/:id
export const getInventoryById = async (req, res, next) => {
    try {
        const inventory = await Inventory.findById(req.params.id).populate("productId");

        if (!inventory) {
            res.status(404);
            throw new Error("Inventory record not found");
        }

        res.status(200).json({
            success: true,
            data: inventory
        });
    } catch (error) {
        next(error);
    }
};


//update stock quantity
// PUT /api/inventory/:id
export const updateInventory = async (req,res,next) => {
    try {
        const inventory = await Inventory.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators:true
            }
        ).populate("productId");

        if(!inventory){
            res.status(404)
            throw new Error("Inventory record not found");
        }

        res.status(200).json({
            success: true,
            message: "Inventory updated successfully",
            data:inventory,
        });

    } catch (error) {
        next(error);
    }
};


//Delete an inventory record
// DELETE /api/inventory/:id
export const deleteInventory = async (req,res,next) => {
    try {
        const inventory = await Inventory.findByIdAndDelete(req.params.id);

        if(!inventory){
            res.status(404);
            throw new Error("Inventory record not found");
        }

        res.status(200).json({
            success : true,
            message : "Inventory record deleted successfully",
        })
    } catch (error) {
        next(error);
    }
}