const City = require('../models/city');

// Get all cities
const getCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cities", error });
  }
};

// Add a new city
const addCity = async (req, res) => {
  try {
    const { name } = req.body;
    const existingCity = await City.findOne({ name });

    if (existingCity)
      return res.status(400).json({ message: "City already exists" });

    const newCity = new City({ name });
    await newCity.save();

    res.status(201).json({ message: "City added successfully", city: newCity });
  } catch (error) {
    res.status(500).json({ message: "Error adding city", error });
  }
};

module.exports = {
  getCities,
  addCity
};
