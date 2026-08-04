const express = require('express');
const router = express.Router();
const controller = require('../controllers/commandes.controller.js');
router.get('/commandes/:client_id', controller.getCommandesByClient);
router.get('/commandes', controller.getAllCommandes);
router.get('/stats/commandes', controller.getCommandesStats);

router.post('/commandes/:client_id', controller.createCommande);
router.patch('/commandes/:id', controller.updateCommande);
router.delete('/commandes/:id', controller.deleteCommande);
module.exports = router;
