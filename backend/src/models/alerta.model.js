const pool = require('../config/db');

async function listAlerts() {
	const [rows] = await pool.execute(
		`SELECT a.id, a.tipo, a.descripcion, a.zona_id, z.nombre AS zona_nombre, a.ruta_id, r.nombre AS ruta_nombre, a.usuario_id, u.nombre AS usuario_nombre, a.estado, a.created_at
		 FROM alertas a
		 LEFT JOIN zonas z ON z.id = a.zona_id
		 LEFT JOIN rutas r ON r.id = a.ruta_id
		 LEFT JOIN usuarios u ON u.id = a.usuario_id
		 ORDER BY a.id DESC`
	);
	return rows;
}

async function getAlertById(id) {
	const [rows] = await pool.execute(
		`SELECT a.id, a.tipo, a.descripcion, a.zona_id, z.nombre AS zona_nombre, a.ruta_id, r.nombre AS ruta_nombre, a.usuario_id, u.nombre AS usuario_nombre, a.estado, a.created_at
		 FROM alertas a
		 LEFT JOIN zonas z ON z.id = a.zona_id
		 LEFT JOIN rutas r ON r.id = a.ruta_id
		 LEFT JOIN usuarios u ON u.id = a.usuario_id
		 WHERE a.id = ?`,
		[id]
	);
	return rows[0] || null;
}

async function createAlert({ tipo, descripcion, zona_id = null, ruta_id = null, usuario_id = null, estado = 'abierta' }) {
	const [result] = await pool.execute(
		'INSERT INTO alertas (tipo, descripcion, zona_id, ruta_id, usuario_id, estado) VALUES (?, ?, ?, ?, ?, ?)',
		[tipo, descripcion, zona_id, ruta_id, usuario_id, estado]
	);
	return getAlertById(result.insertId);
}

async function updateAlert(id, { tipo, descripcion, zona_id = null, ruta_id = null, usuario_id = null, estado = 'abierta' }) {
	const [result] = await pool.execute(
		'UPDATE alertas SET tipo = ?, descripcion = ?, zona_id = ?, ruta_id = ?, usuario_id = ?, estado = ? WHERE id = ?',
		[tipo, descripcion, zona_id, ruta_id, usuario_id, estado, id]
	);
	if (result.affectedRows === 0) {
		return null;
	}
	return getAlertById(id);
}

async function resolveAlert(id) {
	const [result] = await pool.execute('UPDATE alertas SET estado = ? WHERE id = ?', ['resuelta', id]);
	if (result.affectedRows === 0) {
		return null;
	}
	return getAlertById(id);
}

async function deleteAlert(id) {
	const [result] = await pool.execute('DELETE FROM alertas WHERE id = ?', [id]);
	return result.affectedRows > 0;
}

module.exports = {
	listAlerts,
	getAlertById,
	createAlert,
	updateAlert,
	resolveAlert,
	deleteAlert
};
 
