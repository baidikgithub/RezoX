import PropertyType from '../models/propertyType.model.js';

export const getPropertyTypes = async (req, res) => {
    try {
        const propertyTypes = await PropertyType.find();
        res.status(200).json(propertyTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addPropertyType = async (req, res) => {
    try {
        const newPropertyType = new PropertyType(req.body);
        await newPropertyType.save();
        res.status(201).json(newPropertyType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePropertyType = async (req, res) => {
    try {
        const updatedPropertyType = await PropertyType.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedPropertyType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePropertyType = async (req, res) => { 
    try {
        const deletedPropertyType = await PropertyType.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedPropertyType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
