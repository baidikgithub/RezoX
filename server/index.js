import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import propertyRoutes from "./routes/propertyRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import propertyTypeRoutes from "./routes/propertyType.routes.js";
import priceRangeRoutes from "./routes/priceRange.routes.js";
import bedroomsRoutes from "./routes/bedrooms.routes.js";
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/properties", propertyRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/property-types", propertyTypeRoutes);
app.use("/api/price-ranges", priceRangeRoutes);
app.use("/api/bedrooms", bedroomsRoutes);
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
