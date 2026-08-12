const express = require('express');
const router = express.Router();

const controller = require('../controllers/mesures.controller.js');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware.js');


router.get(
    '/mesures/:client_id',
    verifyToken,
    controller.getMesuresByClient
);

router.get(
    '/mesures/:mesure_id/historique',
    verifyToken,
    controller.getMesuresHistorique
);


router.post(
    '/mesures/:client_id',
    verifyToken,
    controller.addMesures
);

router.patch(
    '/mesures/:id',
    verifyToken,
    controller.updateMesures
);


router.delete(
    '/mesures/:id',
    verifyToken,
    requireAdmin,
    controller.deleteMesure
);

module.exports = router;