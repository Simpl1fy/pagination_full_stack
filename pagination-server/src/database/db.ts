import mongoose from "mongoose";
require('dotenv').config();

const mongoURI: string = process.env.LOCAL_MONGO_URI || "";

const connectDB = async() => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Successfully connected to mongodb server");
  } catch(err) {
    console.error("Mongodb connection error =", (err as Error).message);
    process.exit(1);
  }
}

mongoose.connection.on('disconnected', () => {
  console.log("Disconnected from the mongodb server");
})

export default connectDB;