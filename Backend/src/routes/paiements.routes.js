const express = require('express');
const router = express.Router();
const controller = require('../controllers/paiements.controller.js');
router.get('/paiements/:commande_id', controller.getPaiementsByCommandes);
router.post('/paiements/:commande_id', controller.addPaiement);
router.patch('/paiements/:id', controller.updatePaiement);
router.delete('/paiements/:id', controller.deletePaiement);
module.exports = router; 