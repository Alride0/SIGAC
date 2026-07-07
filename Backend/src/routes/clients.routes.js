const express = require('express');
const router = express.Router();
const controller = require('../controllers/clients.controller.js');
router.get('/clients', controller.getAllClients);
router.post('/clients', controller.createClient);
router.delete('/clients/:id', controller.deleteClient);
router.patch('/clients/:id', controller.updateClient);
module.exports = router;