import express from "express";
import { spawn } from "child_process";
import path from "path";

const router = express.Router();

router.post("/predict-price", (req, res) => {
  const { location, sqft, bath, bhk } = req.body;

  if (!location || !sqft || !bath || !bhk) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const scriptPath = path.resolve("../ml/src/predict.py");

  const python = spawn("python3", [
    scriptPath,
    location,
    String(sqft),
    String(bath),
    String(bhk)
  ]);

  let result = "";
  python.stdout.on("data", (data) => (result += data.toString()));
  python.stderr.on("data", (err) => console.error("Python error:", err.toString()));

  python.on("close", () => {
    const num = parseFloat(result);
    if (isNaN(num)) {
      return res.status(500).json({ error: "Invalid model output" });
    }
    res.json({ predicted_price: num });
  });
});

export default router;
