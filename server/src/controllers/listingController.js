import Listing from "../models/Listing.js";

// GET listings + filters
export async function getListings(req, res) {
  try {
    const { location, minPrice, maxPrice, bhk } = req.query;

    const query = {};

    if (location) query.location = { $regex: location, $options: "i" };
    if (minPrice) query.price = { $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
    if (bhk) query.bhk = Number(bhk);

    const listings = await Listing.find(query);
    res.json(listings);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// POST add listing (Admin)
export async function createListing(req, res) {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
