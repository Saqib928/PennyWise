import mongoose from "mongoose";

export async function connectMongo() {
  const uri = process.env.MONGO_URL!;
  await mongoose.connect(uri);
  console.log("🟢 MongoDB connected");
}
