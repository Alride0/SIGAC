const express = require('express');
const router = express.Router();

const controller = require('../controllers/paiements.controller.js');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware.js');


router.get(
    '/paiements',
    verifyToken,
    controller.getAllPaiements
);

router.get(
    '/paiements/:commande_id',
    verifyToken,
    controller.getPaiementsByCommandes
);

router.get(
    '/stats/paiements',
    verifyToken,
    controller.getPaiementsStats
);


router.post(
    '/paiements/:commande_id',
    verifyToken,
    controller.addPaiement
);

router.patch(
    '/paiements/:id',
    verifyToken,
    controller.updatePaiement
);


router.delete(
    '/paiements/:id',
    verifyToken,
    requireAdmin,
    controller.deletePaiement
);

module.exports = router;