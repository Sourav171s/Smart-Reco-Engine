import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolving ES modules pathing because this file runs independently outside of src/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

// Importing models using absolute paths relative to this script
import connectDB from "../src/config/db.js";
import Product from "../src/models/Product.js";
import Inventory from "../src/models/Inventory.js";
import Recommendation from "../src/models/Recommendation.js";

const dataset = [
    // === 1. MILK CATEGORY ===
    { productName: "Amul Taaza Milk 500ml", category: "Milk", brand: "Amul", price: 27, rating: 4.5, stock: 150 },
    { productName: "Mother Dairy Toned Milk 500ml", category: "Milk", brand: "Mother Dairy", price: 26, rating: 4.0, stock: 0 }, // OUT OF STOCK
    { productName: "Nandini Toned Milk 500ml", category: "Milk", brand: "Nandini", price: 24, rating: 4.3, stock: 95 },
    { productName: "Heritage Toned Milk 500ml", category: "Milk", brand: "Heritage", price: 25, rating: 3.9, stock: 40 },
    { productName: "Amul Gold Milk 500ml", category: "Milk", brand: "Amul", price: 33, rating: 4.7, stock: 120 },

    // === 2. BREAD CATEGORY ===
    { productName: "Britannia Premium Sandwich Bread", category: "Bread", brand: "Britannia", price: 45, rating: 4.4, stock: 60 },
    { productName: "Harvest Gold White Bread", category: "Bread", brand: "Harvest Gold", price: 40, rating: 4.1, stock: 80 },
    { productName: "Modern Brown Bread", category: "Bread", brand: "Modern", price: 50, rating: 4.2, stock: 0 }, // OUT OF STOCK
    { productName: "Britannia 100% Whole Wheat Bread", category: "Bread", brand: "Britannia", price: 55, rating: 4.6, stock: 35 },
    { productName: "English Oven Milk Bread", category: "Bread", brand: "English Oven", price: 42, rating: 4.3, stock: 70 },

    // === 3. BISCUITS CATEGORY ===
    { productName: "Britannia Good Day Cashew 200g", category: "Biscuits", brand: "Britannia", price: 30, rating: 4.5, stock: 250 },
    { productName: "Parle Marie Gold 250g", category: "Biscuits", brand: "Parle", price: 25, rating: 4.1, stock: 180 },
    { productName: "Cadbury Oreo Original 120g", category: "Biscuits", brand: "Cadbury", price: 40, rating: 4.6, stock: 0 }, // OUT OF STOCK
    { productName: "Parle Hide & Seek Chocolate 100g", category: "Biscuits", brand: "Parle", price: 50, rating: 4.7, stock: 140 },
    { productName: "Sunfeast Dark Fantasy Choco Fills", category: "Biscuits", brand: "Sunfeast", price: 90, rating: 4.8, stock: 90 },

    // === 4. JUICE CATEGORY ===
    { productName: "Real Mango Juice 1L", category: "Juice", brand: "Real", price: 110, rating: 4.3, stock: 50 },
    { productName: "Tropicana 100% Orange Juice 1L", category: "Juice", brand: "Tropicana", price: 140, rating: 4.5, stock: 35 },
    { productName: "B Natural Mixed Fruit Juice 1L", category: "Juice", brand: "B Natural", price: 100, rating: 4.0, stock: 65 },
    { productName: "Real Guava Juice 1L", category: "Juice", brand: "Real", price: 115, rating: 4.2, stock: 0 }, // OUT OF STOCK
    { productName: "Tropicana Apple Juice 1L", category: "Juice", brand: "Tropicana", price: 135, rating: 4.4, stock: 40 },

    // === 5. TEA & COFFEE CATEGORY ===
    { productName: "Tata Tea Gold 500g", category: "Tea_Coffee", brand: "Tata", price: 320, rating: 4.5, stock: 110 },
    { productName: "Brooke Bond Red Label 500g", category: "Tea_Coffee", brand: "Brooke Bond", price: 290, rating: 4.2, stock: 130 },
    { productName: "Taj Mahal Tea 250g", category: "Tea_Coffee", brand: "Taj Mahal", price: 210, rating: 4.7, stock: 0 }, // OUT OF STOCK
    { productName: "Nescafe Classic Instant Coffee 100g", category: "Tea_Coffee", brand: "Nescafe", price: 360, rating: 4.6, stock: 85 },
    { productName: "Bru Instant Coffee Packet 100g", category: "Tea_Coffee", brand: "Bru", price: 240, rating: 4.1, stock: 105 },

    // === 6. RICE CATEGORY ===
    { productName: "India Gate Basmati Rice Rozana 5kg", category: "Rice", brand: "India Gate", price: 450, rating: 4.3, stock: 40 },
    { productName: "Fortune Rozana Basmati Rice 5kg", category: "Rice", brand: "Fortune", price: 399, rating: 4.0, stock: 60 },
    { productName: "Daawat Rozana Super Basmati 5kg", category: "Rice", brand: "Daawat", price: 425, rating: 4.2, stock: 55 },
    { productName: "India Gate Basmati Rice Premium 5kg", category: "Rice", brand: "India Gate", price: 750, rating: 4.8, stock: 0 }, // OUT OF STOCK
    { productName: "Kohinoor Super Silver Basmati 5kg", category: "Rice", brand: "Kohinoor", price: 620, rating: 4.5, stock: 30 },

    // === 7. HAIR & BODY CARE CATEGORY ===
    { productName: "Clinic Plus Strong & Long Shampoo 340ml", category: "Hair_Body", brand: "Clinic Plus", price: 210, rating: 4.1, stock: 100 },
    { productName: "Sunsilk Stunning Black Shine 340ml", category: "Hair_Body", brand: "Sunsilk", price: 235, rating: 4.3, stock: 85 },
    { productName: "Dove Hair Fall Rescue Shampoo 340ml", category: "Hair_Body", brand: "Dove", price: 310, rating: 4.6, stock: 0 }, // OUT OF STOCK
    { productName: "Tresemme Keratin Smooth Shampoo 340ml", category: "Hair_Body", brand: "Tresemme", price: 380, rating: 4.5, stock: 45 },
    { productName: "Lux Velvet Touch Soap 100g", category: "Hair_Body", brand: "Lux", price: 38, rating: 4.0, stock: 200 },

    // === 8. SNACKS CATEGORY ===
    { productName: "Lays Classic Salted Chips Party Pack", category: "Snacks", brand: "Lays", price: 50, rating: 4.5, stock: 300 },
    { productName: "Kurkure Masala Munch Large", category: "Snacks", brand: "Kurkure", price: 30, rating: 4.4, stock: 400 },
    { productName: "Bingo Mad Angles Achari Masti", category: "Snacks", brand: "Bingo", price: 20, rating: 4.2, stock: 0 }, // OUT OF STOCK
    { productName: "Pringles Sour Cream & Onion", category: "Snacks", brand: "Pringles", price: 115, rating: 4.6, stock: 150 },
    { productName: "Doritos Cheese Nachos Large Pack", category: "Snacks", brand: "Doritos", price: 60, rating: 4.3, stock: 180 }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        // 1. Clear existing database collections safely to maintain idempotency
        await Product.deleteMany();
        await Inventory.deleteMany();
        await Recommendation.deleteMany(); // Keeping recommendation collection at 0 records
        console.log("Safely cleared old Products, Inventory, and Cached Recommendations collections.");

        let insertedProductsCount = 0;
        let insertedInventoryCount = 0;

        // 2. Loop sequentially to handle individual object relational references
        for (const item of dataset) {
            const product = await Product.create({
                productName: item.productName,
                category: item.category,
                brand: item.brand,
                price: item.price,
                rating: item.rating
            });
            insertedProductsCount++;

            await Inventory.create({
                productId: product._id,
                availableQuantity: item.stock
            });
            insertedInventoryCount++;
        }

        console.log("\n=======================================================");
        console.log("⚡ SEED SCRIPT COMPLETE SUMMARY");
        console.log("=======================================================");
        console.log(`📦 Products Injected:     ${insertedProductsCount} rows`);
        console.log(`📦 Inventory Rows Linked: ${insertedInventoryCount} rows`);
        console.log(`🤖 Recommendations Count: 0 rows (Left blank intentionally for engine computation)`);
        console.log("=======================================================\n");

        process.exit(0);
    } catch (error) {
        console.error(`System Execution Failure during database seed sequence: ${error.message}`);
        process.exit(1);
    }
};

seedDatabase();