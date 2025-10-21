import express from 'express';
import { getPriceRanges, addPriceRange, updatePriceRange, deletePriceRange } from '../controllers/priceRange.controller.js';
const router = express.Router();

router.get('/', getPriceRanges);
router.post('/', addPriceRange);
router.put('/:id', updatePriceRange);
router.delete('/:id', deletePriceRange);

export default router;