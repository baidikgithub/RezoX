import express from 'express';
import { getPropertyTypes, addPropertyType, updatePropertyType, deletePropertyType } from '../controllers/propertyType.controller.js';
const router = express.Router();

router.get('/', getPropertyTypes);
router.post('/', addPropertyType);
router.put('/:id', updatePropertyType);
router.delete('/:id', deletePropertyType);

export default router;