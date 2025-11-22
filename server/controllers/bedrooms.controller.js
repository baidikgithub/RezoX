import Bedrooms from '../models/bedrooms.model.js';

export const getBedrooms = async (req, res) => {
    try {
        const bedrooms = await Bedrooms.find();
        res.status(200).json(bedrooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addBedrooms = async (req, res) => {    
    try {
        const newBedrooms = new Bedrooms(req.body);
        await newBedrooms.save();
        res.status(201).json(newBedrooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBedrooms = async (req, res) => {
    try {
        const updatedBedrooms = await Bedrooms.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedBedrooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteBedrooms = async (req, res) => {
    try {
        const deletedBedrooms = await Bedrooms.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedBedrooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  