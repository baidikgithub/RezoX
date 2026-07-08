import express from "express";

const router = express.Router();

function fallbackPrediction({ sqft, bath, bhk }) {
  const base = Number(sqft) * 0.055;
  const roomPremium = Number(bhk) * 7 + Number(bath) * 3.5;
  return Number((base + roomPremium).toFixed(2));
}

router.post("/predict-price", async (req, res) => {
  const { location, sqft, bath, bhk } = req.body;

  if (!location || !sqft || !bath || !bhk) {
    return res.status(400).json({ error: "location, sqft, bath, and bhk are required." });
  }

  try {
    const mlUrl = process.env.ML_API_URL;
    if (mlUrl) {
      const response = await fetch(`${mlUrl.replace(/\/$/, "")}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, total_sqft: Number(sqft), bath: Number(bath), bhk: Number(bhk) })
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "ML service failed.");
      const predicted = json.predicted_price || json.prediction || json.price;
      return res.json({ predicted_price: Number(predicted), source: "ml-service" });
    }

    return res.json({ predicted_price: fallbackPrediction({ sqft, bath, bhk }), source: "fallback-model" });
  } catch (error) {
    return res.json({
      predicted_price: fallbackPrediction({ sqft, bath, bhk }),
      source: "fallback-model",
      warning: error.message
    });
  }
});

export default router;
