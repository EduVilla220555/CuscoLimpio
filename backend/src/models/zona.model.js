const pool = require('../config/db');

async function listZones() {
	const [rows] = await pool.execute(
		'SELECT id, nombre, descripcion, distrito, calles_recorrer, centro_lat, centro_lng, created_at FROM zonas ORDER BY id DESC'
	);
	return rows;
}

async function getZoneById(id) {
	const [rows] = await pool.execute(
		'SELECT id, nombre, descripcion, distrito, calles_recorrer, centro_lat, centro_lng, created_at FROM zonas WHERE id = ?',
		[id]
	);
	return rows[0] || null;
}

async function createZone({ nombre, descripcion = null, distrito = null, calles_recorrer = null, centro_lat = null, centro_lng = null }) {
	const [result] = await pool.execute(
		'INSERT INTO zonas (nombre, descripcion, distrito, calles_recorrer, centro_lat, centro_lng) VALUES (?, ?, ?, ?, ?, ?)',
		[nombre, descripcion, distrito, calles_recorrer, centro_lat, centro_lng]
	);
	return getZoneById(result.insertId);
}

async function updateZone(id, { nombre, descripcion, distrito, calles_recorrer, centro_lat, centro_lng }) {
	const fields = [];
	const values = [];

	if (nombre !== undefined) {
		fields.push('nombre = ?');
		values.push(nombre);
	}

	if (descripcion !== undefined) {
		fields.push('descripcion = ?');
		values.push(descripcion);
	}

	if (distrito !== undefined) {
		fields.push('distrito = ?');
		values.push(distrito);
	}

	if (calles_recorrer !== undefined) {
		fields.push('calles_recorrer = ?');
		values.push(calles_recorrer);
	}

	if (centro_lat !== undefined) {
		fields.push('centro_lat = ?');
		values.push(centro_lat);
	}

	if (centro_lng !== undefined) {
		fields.push('centro_lng = ?');
		values.push(centro_lng);
	}

	if (fields.length === 0) {
		return getZoneById(id);
	}

	values.push(id);
	await pool.execute(`UPDATE zonas SET ${fields.join(', ')} WHERE id = ?`, values);
	return getZoneById(id);
}

async function deleteZone(id) {
	const [result] = await pool.execute('DELETE FROM zonas WHERE id = ?', [id]);
	return result.affectedRows > 0;
}

module.exports = {
	listZones,
	getZoneById,
	createZone,
	updateZone,
	deleteZone
};
 
