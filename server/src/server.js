import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import listingRoutes from "./routes/listingRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";

const app = express();

// FIX CORS ISSUE HERE
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// DB
await connectDB();

// Routes
app.use("/api/listings", listingRoutes);
app.use("/api/predict", predictionRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
