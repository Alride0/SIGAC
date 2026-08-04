const express = require('express');
const router = express.Router();
const controller = require('../controllers/clients.controller.js');
const { clientValidationRules, validate } = require('../middlewares/validateClient');

router.get('/clients', controller.getAllClients);
router.post('/clients', clientValidationRules(), validate, controller.createClient);
router.delete('/clients/:id', controller.deleteClient);
router.put('/clients/:id', clientValidationRules(), validate, controller.updateClient);

module.exports = router;