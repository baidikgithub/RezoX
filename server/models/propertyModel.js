import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  zipCode: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
});

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String },
});

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    location: locationSchema,
    propertyType: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    area: { type: Number, required: true },
    images: [imageSchema],
    amenities: [String],
    features: [String],
    availability: { type: String, enum: ["available", "sold", "rented"], default: "available" },
    isFeatured: { type: Boolean, default: false },
    description: { type: String },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;
