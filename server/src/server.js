import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

import connectDB from "./config/db.js";
import listingRoutes from "./routes/listingRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FIX CORS ISSUE HERE
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// DB
await connectDB();

// Routes
app.use("/api/listings", listingRoutes);
app.use("/api/predict", predictionRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
