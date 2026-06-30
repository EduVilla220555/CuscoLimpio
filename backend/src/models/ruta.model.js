const pool = require('../config/db');

async function listRoutes() {
	const [rows] = await pool.execute(
		`SELECT r.id, r.nombre, r.lugares_recorrido, r.zona_id, z.nombre AS zona_nombre, r.operario_id, u.nombre AS operario_nombre, r.fecha_inicio, r.fecha_fin, r.estado, r.puntos_completados, r.created_at
		 FROM rutas r
		 LEFT JOIN zonas z ON z.id = r.zona_id
		 LEFT JOIN usuarios u ON u.id = r.operario_id
		 ORDER BY r.id DESC`
	);
	return rows;
}

async function getRouteById(id) {
	const [rows] = await pool.execute(
		`SELECT r.id, r.nombre, r.lugares_recorrido, r.zona_id, z.nombre AS zona_nombre, r.operario_id, u.nombre AS operario_nombre, r.fecha_inicio, r.fecha_fin, r.estado, r.puntos_completados, r.created_at
		 FROM rutas r
		 LEFT JOIN zonas z ON z.id = r.zona_id
		 LEFT JOIN usuarios u ON u.id = r.operario_id
		 WHERE r.id = ?`,
		[id]
	);
	return rows[0] || null;
}

async function createRoute({ nombre, lugares_recorrido = null, zona_id = null, operario_id = null, fecha_inicio = null, fecha_fin = null, estado = 'pendiente' }) {
	const [result] = await pool.execute(
		'INSERT INTO rutas (nombre, lugares_recorrido, zona_id, operario_id, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
		[nombre, lugares_recorrido, zona_id, operario_id, fecha_inicio, fecha_fin, estado]
	);
	return getRouteById(result.insertId);
}

async function updateRoute(id, { nombre, lugares_recorrido, zona_id, operario_id, fecha_inicio, fecha_fin, estado, puntos_completados }) {
	const fields = [];
	const values = [];

	if (nombre !== undefined) {
		fields.push('nombre = ?');
		values.push(nombre);
	}
	if (lugares_recorrido !== undefined) {
		fields.push('lugares_recorrido = ?');
		values.push(lugares_recorrido);
	}
	if (zona_id !== undefined) {
		fields.push('zona_id = ?');
		values.push(zona_id);
	}
	if (operario_id !== undefined) {
		fields.push('operario_id = ?');
		values.push(operario_id);
	}
	if (fecha_inicio !== undefined) {
		fields.push('fecha_inicio = ?');
		values.push(fecha_inicio);
	}
	if (fecha_fin !== undefined) {
		fields.push('fecha_fin = ?');
		values.push(fecha_fin);
	}
	if (estado !== undefined) {
		fields.push('estado = ?');
		values.push(estado);
	}
	if (puntos_completados !== undefined) {
		fields.push('puntos_completados = ?');
		values.push(puntos_completados);
	}

	if (fields.length === 0) {
		return getRouteById(id);
	}

	values.push(id);
	await pool.execute(`UPDATE rutas SET ${fields.join(', ')} WHERE id = ?`, values);
	return getRouteById(id);
}

async function deleteRoute(id) {
	const [result] = await pool.execute('DELETE FROM rutas WHERE id = ?', [id]);
	return result.affectedRows > 0;
}

module.exports = {
	listRoutes,
	getRouteById,
	createRoute,
	updateRoute,
	deleteRoute
};
 
