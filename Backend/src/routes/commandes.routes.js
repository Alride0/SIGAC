const express = require('express');
const router = express.Router();

const controller = require('../controllers/commandes.controller.js');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware.js');


router.get(
    '/commandes/:client_id',
    verifyToken,
    controller.getCommandesByClient
);

router.get(
    '/commandes',
    verifyToken,
    controller.getAllCommandes
);

router.get(
    '/stats/commandes',
    verifyToken,
    controller.getCommandesStats
);


router.post(
    '/commandes/:client_id',
    verifyToken,
    controller.createCommande
);


router.patch(
    '/commandes/:id',
    verifyToken,
    controller.updateCommande
);


router.delete(
    '/commandes/:id',
    verifyToken,
    requireAdmin,
    controller.deleteCommande
);

module.exports = router;