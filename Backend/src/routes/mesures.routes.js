const express = require('express');
const router = express.Router();
const controller = require('../controllers/mesures.controller.js');
router.get('/mesures/:client_id', controller.getMesuresByClient);
router.get('/mesures/:mesure_id/historique', controller.getMesuresHistorique);
router.post('/mesures/:client_id', controller.addMesures);
router.patch('/mesures/:id', controller.updateMesures);
router.delete('/mesures/:id', controller.deleteMesure);

module.exports = router;