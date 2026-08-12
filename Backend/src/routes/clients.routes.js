const express = require('express');
const router = express.Router();

const controller = require('../controllers/clients.controller.js');

const { clientValidationRules, validate } = require('../middlewares/validateClient');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware.js');


router.get(
    '/clients',
    verifyToken,
    controller.getAllClients
);


router.post(
    '/clients',
    verifyToken,
    clientValidationRules(),
    validate,
    controller.createClient
);


router.delete(
    '/clients/:id',
    verifyToken,
    requireAdmin,
    controller.deleteClient
);


router.put(
    '/clients/:id',
    verifyToken,
    clientValidationRules(),
    validate,
    controller.updateClient
);

module.exports = router;