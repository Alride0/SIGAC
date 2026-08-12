const express = require('express');
const authController = require('../controllers/auth.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();


router.post('/auth/login', authController.login);


router.post('/auth/forgot-password', authController.forgotPassword);


router.post('/auth/reset-password', authController.resetPassword);


router.post(
    '/auth/register',
    verifyToken,
    requireAdmin,
    authController.register
);


router.get(
    '/auth/profile',
    verifyToken,
    authController.getProfile
);


router.post(
    '/auth/change-password',
    verifyToken,
    authController.changePassword
);


router.get(
    '/auth/users',
    verifyToken,
    requireAdmin,
    authController.getAllUsers
);

module.exports = router;