import dotenv from "dotenv";
dotenv.config(); 

import { app } from "./app";
import { connectMongo } from "./config/db";

const PORT = process.env.PORT || 5000;

connectMongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log("✅ Server running on port", PORT);
    });
  })
  .catch((err: Error) => {
    console.error("❌ MongoDB connection error:", err);
  });
