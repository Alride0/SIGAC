const express = require('express');
const router = express.Router();
const controller = require('../controllers/stats.controller.js');

router.get('/stats/mesures', controller.getMesuresStats);

module.exports = router;