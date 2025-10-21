import Location from "../models/locationModel.js";

// Add a new location
export const addLocation = async (req, res) => {
  try {
    const { label } = req.body;

    if (!label) {
      return res.status(400).json({ message: "Label is required" });
    }

    const existing = await Location.findOne({ label });
    if (existing) {
      return res.status(400).json({ message: "Location already exists" });
    }

    const newLocation = new Location({ label });
    await newLocation.save();

    res.status(201).json({
      message: "Location added successfully",
      data: newLocation,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding location", error: error.message });
  }
};

// Get all locations
export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ label: 1 });
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching locations", error: error.message });
  }
};
