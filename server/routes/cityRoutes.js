const express = require('express');
const { getCities, addCity } = require('../controllers/cityController');

const router = express.Router();

router.get("/", getCities);   // GET all cities
router.post("/", addCity);    // POST add city

module.exports = router;
