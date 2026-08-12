const express = require('express');
const router = express.Router();

const controller = require('../controllers/stats.controller.js');
const { verifyToken } = require('../middlewares/auth.middleware.js');

router.get(
    '/stats/mesures',
    verifyToken,
    controller.getMesuresStats
);

module.exports = router;