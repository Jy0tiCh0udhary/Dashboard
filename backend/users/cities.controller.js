const express = require('express');
const router = express.Router();
const cors = require('cors');
const userService = require('./user.service');

// routes
router.get('/', getAllCities);
module.exports = router;

function getAllCities(req, res, next) {
    userService.getAllCities()
        .then(city => res.json(city))
        .catch(err => next(err));
}