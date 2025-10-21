import express from 'express';
import { getBedrooms, addBedrooms, updateBedrooms, deleteBedrooms } from '../controllers/bedrooms.controller.js';
const router = express.Router();

router.get('/', getBedrooms);
router.post('/', addBedrooms);
router.put('/:id', updateBedrooms);
router.delete('/:id', deleteBedrooms);

export default router;