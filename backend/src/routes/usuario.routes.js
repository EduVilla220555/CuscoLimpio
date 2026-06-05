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
router.use(requireRole('admin'));

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.store);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
 
