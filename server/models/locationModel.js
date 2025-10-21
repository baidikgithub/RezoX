import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const Location = mongoose.model("Location", locationSchema);
export default Location;
