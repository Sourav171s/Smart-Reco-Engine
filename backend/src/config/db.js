import mongoose from 'mongoose';

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected successfully");
    } catch (error) {
        console.error("DB connection failed:", error.message);
        throw error;
    }
};

export default dbConnect;
