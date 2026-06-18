
// WHAT IS THIS FILE?
// This file defines the "shape" of a Product document in MongoDB.
// Think of it like a template — every product saved in the database
// MUST follow this structure.

// Step 1: Import mongoose
// Mongoose is the library that connects our JavaScript code to MongoDB.
// It lets us define schemas, validate data, and query the database.
import mongoose from 'mongoose';

// Step 2: Define the Product Schema
// We call `new mongoose.Schema({...})` and pass an object describing each field.
// Each field has a "type" and optional rules like "required", "min", "max", etc.
const productSchema = new mongoose.Schema(
  {
    // ---- productName ----
    // The name of the product, e.g., "Amul Milk", "Mother Dairy Curd"
    // `type: String`   → this field must be a text string
    // `required: true` → this field CANNOT be empty. If someone tries to
    //                     create a product without a name, Mongoose will
    //                     throw a ValidationError.
    // `trim: true`     → automatically removes extra spaces from both ends
    //                     e.g., "  Amul Milk  " becomes "Amul Milk"
    productName: {
      type: String,
      required: [true, 'Product name is required'],  // custom error message
      trim: true,
    },

    // ---- category ----
    // The category this product belongs to, e.g., "Milk", "Curd", "Butter"
    // This is VERY important because the recommendation engine only
    // recommends products from the SAME category.
    // We add an INDEX on this field (see bottom of file) for faster searches.
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },

    // ---- brand ----
    // The brand/manufacturer, e.g., "Amul", "Mother Dairy", "Nandini"
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },

    // ---- price ----
    // The price of the product in rupees (₹), e.g., 60, 45.5
    // `min: 0` → price cannot be negative (no product costs -₹50!)
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },

    // ---- rating ----
    // Customer rating from 0 to 5 (like Amazon stars), e.g., 4.2
    // `min: 0, max: 5` → VALIDATION: rating must be between 0 and 5
    //   If someone tries to save rating: 7, Mongoose will REJECT it
    //   with an error: "Rating must be at most 5"
    // `default: 0` → if no rating is provided, it defaults to 0
    //
    // THIS IS AN ACCEPTANCE CRITERIA:
    //   "Invalid data (e.g. rating > 5) is rejected" ✅
    rating: {
      type: Number,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating must be at most 5'],
      default: 0,
    },
  },
  {
    // ---- timestamps option ----
    // When set to true, Mongoose AUTOMATICALLY adds two fields:
    //   - createdAt: the date/time this product was first created
    //   - updatedAt: the date/time this product was last modified
    // You don't need to manage these yourself — Mongoose handles it!
    timestamps: true,
  }
);

// Step 3: Create an INDEX on the "category" field
// -----------------------------------------------
// WHAT IS AN INDEX?
// An index is like a "table of contents" for the database.
// Without an index, MongoDB has to scan EVERY document to find
// products in a specific category (slow for large datasets).
// With an index, it can jump directly to the right documents (fast!).
//
// WHY category?
// The recommendation engine filters products by category constantly.
// This index makes those lookups much faster.
//
// The `1` means "ascending order" (A→Z). You could use `-1` for
// descending, but for simple lookups it doesn't matter.
productSchema.index({ category: 1 });

// Step 4: Create and Export the Model
// ------------------------------------
// `mongoose.model('Product', productSchema)` does two things:
//   1. Creates a MODEL class called "Product"
//   2. Tells MongoDB to store these documents in a COLLECTION
//      called "products" (Mongoose automatically lowercases and
//      pluralizes the name: "Product" → "products")
//
// After this, we can use:
//   Product.create({...})  → save a new product
//   Product.find()         → get all products
//   Product.findById(id)   → get one product by its ID
//   Product.updateOne()    → update a product
//   Product.deleteOne()    → delete a product
const Product = mongoose.model('Product', productSchema);

// `export default` makes this model available to other files.
// Other files can import it like:
//   import Product from './models/Product.js';
export default Product;
