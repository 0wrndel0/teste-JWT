import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Conectado com o MongoDB");
};

export default connectDB;
