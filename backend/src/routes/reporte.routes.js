const express = require('express');
const controller = require('../controllers/reporte.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/diarios', controller.daily);
router.get('/zona/:zonaId', controller.byZone);
router.get('/tipo/:tipoId', controller.byType);

module.exports = router;
 
