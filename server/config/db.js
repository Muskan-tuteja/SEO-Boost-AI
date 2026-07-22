import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.log("Error Name:", err.name);
    console.log("Error Message:", err.message);
    console.log(err);
  }
};

export default connectDB;