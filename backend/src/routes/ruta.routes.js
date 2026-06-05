const express = require('express');
const controller = require('../controllers/ruta.controller');
const authMiddleware = require('../middlewares/auth.middleware');

function requireRole(...roles) {
	return (req, res, next) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({ success: false, message: 'Acceso denegado' });
		}
		return next();
	};
}

const router = express.Router();

router.use(authMiddleware);

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', requireRole('admin', 'supervisor'), controller.store);
router.put('/:id', requireRole('admin', 'supervisor'), controller.update);
router.delete('/:id', requireRole('admin', 'supervisor'), controller.destroy);

module.exports = router;
 
