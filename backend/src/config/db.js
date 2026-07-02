import mongoose from 'mongoose';

const dbConnect = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is required");
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected successfully");
    } catch (error) {
        console.error("DB connection failed:", error.message);
        throw error;
    }
};

export default dbConnect;
