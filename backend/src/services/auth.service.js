const pool = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/helpers');
const jwtUtil = require('../utils/jwt');

async function createUser({ nombre, email, password, role = 'operador' }) {
	const hashed = await hashPassword(password);
	const [result] = await pool.execute(
		'INSERT INTO usuarios (nombre, email, password, role) VALUES (?, ?, ?, ?)',
		[nombre, email, hashed, role]
	);
	return { id: result.insertId, nombre, email, role };
}

async function findByEmail(email) {
	const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
	return rows[0];
}

async function authenticate(email, password) {
	const user = await findByEmail(email);
	if (!user) return null;
	const ok = await comparePassword(password, user.password);
	if (!ok) return null;
	const token = jwtUtil.sign({ id: user.id, role: user.role });
	delete user.password;
	return { user, token };
}

module.exports = {
	createUser,
	findByEmail,
	authenticate
};
 
