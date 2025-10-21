import mongoose from 'mongoose';

const priceRangeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const PriceRange = mongoose.model('PriceRange', priceRangeSchema);
export default PriceRange;