const express = require('express');
const router = express.Router();

const controller = require('../controllers/dashboard.controller.js');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware.js');

router.get(
    '/stats/dashboard',
    verifyToken,
    requireAdmin,
    controller.getDashboardStats
);

module.exports = router;