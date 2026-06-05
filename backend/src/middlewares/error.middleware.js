module.exports = function errorMiddleware(err, req, res, next) {
	console.error(err);
	const status = err.statusCode || err.status || 500;
	const message = err.message || 'Internal server error';
	res.status(status).json({ success: false, message });
};
 
