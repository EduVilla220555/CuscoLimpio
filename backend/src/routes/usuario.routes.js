const express = require('express');
const controller = require('../controllers/usuario.controller');
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

router.get('/', requireRole('admin', 'supervisor'), controller.index);
router.get('/:id', requireRole('admin', 'supervisor'), controller.show);
router.post('/', requireRole('admin'), controller.store);
router.put('/:id', requireRole('admin'), controller.update);
router.delete('/:id', requireRole('admin'), controller.destroy);

module.exports = router;
 
