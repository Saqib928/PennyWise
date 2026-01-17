import { app } from "./app";
import { connectMongo } from "./config/mongo";

const PORT = process.env.PORT || 5000;

connectMongo()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
