import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./src/config/.config.env" });


const connectDatabase = async (): Promise<void> => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not set. Check src/config/.config.env");
  }
  try {
    await mongoose.connect(MONGO_URI, {
    

    } as mongoose.ConnectOptions);

    console.log("Mongoose Connected");
  } catch (error) {
    console.error("Mongoose connection error:", error);
    process.exit(1);
  }
};

export default connectDatabase;