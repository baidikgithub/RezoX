import mongoose from 'mongoose';

const bedroomsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Bedrooms = mongoose.model('Bedrooms', bedroomsSchema);
export default Bedrooms;