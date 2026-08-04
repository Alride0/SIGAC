const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.controller.js');

router.get('/stats/dashboard', controller.getDashboardStats);

module.exports = router;