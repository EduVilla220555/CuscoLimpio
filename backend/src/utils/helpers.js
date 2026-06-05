const bcrypt = require('bcryptjs');

async function hashPassword(password) {
	return bcrypt.hash(password, 10);
}

async function comparePassword(password, hash) {
	return bcrypt.compare(password, hash);
}

function sendJSON(res, status, payload) {
	return res.status(status).json(payload);
}

module.exports = {
	hashPassword,
	comparePassword,
	sendJSON
};
 
