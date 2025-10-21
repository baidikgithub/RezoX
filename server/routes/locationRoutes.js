import express from "express";
import { addLocation, getLocations } from "../controllers/locationController.js";

const router = express.Router();

router.post("/", addLocation);
router.get("/", getLocations);

export default router;
