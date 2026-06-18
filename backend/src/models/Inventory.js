// ============================================================
// Inventory.js — The Inventory Schema (Data Model)
// ============================================================
//
// WHAT IS THIS FILE?
// This file defines the "shape" of an Inventory document in MongoDB.
// Each inventory document tracks HOW MUCH STOCK is available for
// ONE specific product.
//
// RELATIONSHIP:
//   Each Inventory document has a "productId" field that POINTS TO
//   (references) a Product document. This is a 1:1 relationship:
//   one product → one inventory record.
//
//   Product Collection          Inventory Collection
//   ┌──────────────────┐       ┌────────────────────────┐
//   │ _id: "abc123"    │◄──────│ productId: "abc123"    │
//   │ name: "Amul Milk"│       │ availableQuantity: 50  │
//   │ price: 60        │       │ updatedAt: 2026-06-18  │
//   └──────────────────┘       └────────────────────────┘
// ============================================================

// Step 1: Import mongoose
import mongoose from 'mongoose';

// Step 2: Define the Inventory Schema
const inventorySchema = new mongoose.Schema(
  {
    // ---- productId ----
    // This field stores the ID of the product this inventory belongs to.
    //
    // `type: mongoose.Schema.Types.ObjectId`
    //   → ObjectId is MongoDB's special ID format (a unique 24-character hex string)
    //   → Example: "665abf3c9a1b2c3d4e5f6789"
    //   → Every document in MongoDB gets an _id automatically; here we're
    //     STORING another document's _id as a reference (like a "link")
    //
    // `ref: 'Product'`
    //   → This tells Mongoose: "This ObjectId points to a document in
    //     the Product collection." This is what makes .populate() work!
    //   → When we call: Inventory.find().populate('productId')
    //     Mongoose replaces the ID with the FULL product object:
    //
    //     WITHOUT populate:  { productId: "abc123", availableQuantity: 50 }
    //     WITH populate:     { productId: { name: "Amul Milk", price: 60, ... }, availableQuantity: 50 }
    //
    //   THIS IS AN ACCEPTANCE CRITERIA:
    //     ".populate('productId') returns the full product" ✅
    //
    // `required: true`
    //   → Every inventory record MUST be linked to a product.
    //     You can't have stock for "nothing."
    //
    // `unique: true`
    //   → Each product can have only ONE inventory record.
    //     You can't have two separate stock entries for "Amul Milk."
    //     If you try, MongoDB will throw a "duplicate key" error.
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
      unique: true,
    },

    // ---- availableQuantity ----
    // How many units of this product are currently in stock.
    // e.g., 50 means there are 50 units available for sale.
    //
    // `min: 0`   → quantity can't be negative (you can't have -10 items!)
    // `default: 0` → if not specified, assume 0 (out of stock)
    availableQuantity: {
      type: Number,
      required: [true, 'Available quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
  },
  {
    // ---- timestamps option ----
    // Adds `createdAt` and `updatedAt` automatically.
    // `updatedAt` is especially useful here — it tells us
    // WHEN the stock was last updated.
    timestamps: true,
  }
);

// Step 3: Create and Export the Model
// "Inventory" → MongoDB collection will be called "inventories"
const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
