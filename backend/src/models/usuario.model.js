const pool = require('../config/db');

async function listUsers() {
	const [rows] = await pool.execute(
		'SELECT id, nombre, email, role, created_at, updated_at FROM usuarios ORDER BY id DESC'
	);
	return rows;
}

async function getUserById(id) {
	const [rows] = await pool.execute(
		'SELECT id, nombre, email, role, created_at, updated_at FROM usuarios WHERE id = ?',
		[id]
	);
	return rows[0] || null;
}

async function createUser({ nombre, email, password, role }) {
	const [result] = await pool.execute(
		'INSERT INTO usuarios (nombre, email, password, role) VALUES (?, ?, ?, ?)',
		[nombre, email, password, role]
	);
	return getUserById(result.insertId);
}

async function updateUser(id, { nombre, email, password, role }) {
	const fields = [];
	const values = [];

	if (nombre !== undefined) {
		fields.push('nombre = ?');
		values.push(nombre);
	}

	if (email !== undefined) {
		fields.push('email = ?');
		values.push(email);
	}

	if (password !== undefined) {
		fields.push('password = ?');
		values.push(password);
	}

	if (role !== undefined) {
		fields.push('role = ?');
		values.push(role);
	}

	if (fields.length === 0) {
		return getUserById(id);
	}

	values.push(id);
	await pool.execute(`UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`, values);
	return getUserById(id);
}

async function deleteUser(id) {
	const [result] = await pool.execute('DELETE FROM usuarios WHERE id = ?', [id]);
	return result.affectedRows > 0;
}

module.exports = {
	listUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser
};
 
