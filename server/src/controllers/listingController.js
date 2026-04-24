import Listing from "../models/Listing.js";

const toImageUrl = (req, filename) => `${req.protocol}://${req.get("host")}/uploads/${filename}`;

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

// GET listing by id
export async function getListingById(req, res) {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// POST add listing (Admin)
export async function createListing(req, res) {
  try {
    const uploadedImages = (req.files || []).map(file => toImageUrl(req, file.filename));
    const listing = await Listing.create({
      ...req.body,
      images: uploadedImages
    });
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// PUT update listing (Admin)
export async function updateListing(req, res) {
  try {
    let existingImages = [];
    if (req.body.existingImages) {
      try {
        const parsed = JSON.parse(req.body.existingImages);
        existingImages = Array.isArray(parsed) ? parsed : [];
      } catch (_error) {
        existingImages = [];
      }
    }

    const existingListing = await Listing.findById(req.params.id);
    if (!existingListing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const uploadedImages = (req.files || []).map(file => toImageUrl(req, file.filename));
    const mergedExistingImages = existingImages.length > 0 ? existingImages : (existingListing.images || []);
    const nextImages = [...mergedExistingImages, ...uploadedImages];
    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: nextImages },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
