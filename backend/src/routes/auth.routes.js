const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register-supervisor', authMiddleware, authController.createSupervisor);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);

module.exports = router;
 
