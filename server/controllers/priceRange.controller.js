import PriceRange from '../models/priceRange.model.js';

export const getPriceRanges = async (req, res) => {
    try {
        const priceRanges = await PriceRange.find();
        res.status(200).json(priceRanges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addPriceRange = async (req, res) => {
    try {
        const newPriceRange = new PriceRange(req.body);
        await newPriceRange.save();
        res.status(201).json(newPriceRange);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePriceRange = async (req, res) => {
    try {
        const updatedPriceRange = await PriceRange.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedPriceRange);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePriceRange = async (req, res) => {
    try {
        const deletedPriceRange = await PriceRange.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedPriceRange);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

