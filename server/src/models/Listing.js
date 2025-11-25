import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: String,
  location: { type: String, index: true },
  price: Number,       // price in Lakhs
  total_sqft: Number,
  bath: Number,
  bhk: Number,
  amenities: [String],
  createdAt: { type: Date, default: Date.now }
});

const Listing =
  mongoose.models.Listing || mongoose.model("Listing", listingSchema);

export default Listing;
