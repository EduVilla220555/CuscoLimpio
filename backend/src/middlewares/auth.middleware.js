const jwtUtil = require('../utils/jwt');

module.exports = function authMiddleware(req, res, next) {
	const header = req.headers.authorization || req.headers.Authorization;
	if (!header) {
		return res.status(401).json({ success: false, message: 'No token provided' });
	}

	const parts = header.split(' ');
	if (parts.length !== 2 || parts[0] !== 'Bearer') {
		return res.status(401).json({ success: false, message: 'Invalid authorization format' });
	}

	const token = parts[1];
	try {
		const payload = jwtUtil.verify(token);
		req.user = payload;
		return next();
	} catch (err) {
		return res.status(401).json({ success: false, message: 'Invalid or expired token' });
	}
};
 
