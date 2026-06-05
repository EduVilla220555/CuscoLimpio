const pool = require('../config/db');

async function listResidues() {
	const [rows] = await pool.execute(
		`SELECT r.id, r.tipo_id, tr.nombre AS tipo_nombre, r.descripcion, r.peso, r.zona_id, z.nombre AS zona_nombre, r.usuario_id, u.nombre AS usuario_nombre, r.fecha_registro
		 FROM residuos r
		 LEFT JOIN tipos_residuos tr ON tr.id = r.tipo_id
		 LEFT JOIN zonas z ON z.id = r.zona_id
		 LEFT JOIN usuarios u ON u.id = r.usuario_id
		 ORDER BY r.id DESC`
	);
	return rows;
}

async function getResidueById(id) {
	const [rows] = await pool.execute(
		`SELECT r.id, r.tipo_id, tr.nombre AS tipo_nombre, r.descripcion, r.peso, r.zona_id, z.nombre AS zona_nombre, r.usuario_id, u.nombre AS usuario_nombre, r.fecha_registro
		 FROM residuos r
		 LEFT JOIN tipos_residuos tr ON tr.id = r.tipo_id
		 LEFT JOIN zonas z ON z.id = r.zona_id
		 LEFT JOIN usuarios u ON u.id = r.usuario_id
		 WHERE r.id = ?`,
		[id]
	);
	return rows[0] || null;
}

async function listTypes() {
	const [rows] = await pool.execute('SELECT id, nombre, descripcion, created_at FROM tipos_residuos ORDER BY id ASC');
	return rows;
}

async function createResidue({ tipo_id, descripcion = null, peso = 0, zona_id = null, usuario_id = null }) {
	const [result] = await pool.execute(
		'INSERT INTO residuos (tipo_id, descripcion, peso, zona_id, usuario_id) VALUES (?, ?, ?, ?, ?)',
		[tipo_id, descripcion, peso, zona_id, usuario_id]
	);
	return getResidueById(result.insertId);
}

async function updateResidue(id, { tipo_id, descripcion, peso, zona_id, usuario_id }) {
	const fields = [];
	const values = [];

	if (tipo_id !== undefined) {
		fields.push('tipo_id = ?');
		values.push(tipo_id);
	}
	if (descripcion !== undefined) {
		fields.push('descripcion = ?');
		values.push(descripcion);
	}
	if (peso !== undefined) {
		fields.push('peso = ?');
		values.push(peso);
	}
	if (zona_id !== undefined) {
		fields.push('zona_id = ?');
		values.push(zona_id);
	}
	if (usuario_id !== undefined) {
		fields.push('usuario_id = ?');
		values.push(usuario_id);
	}

	if (fields.length === 0) {
		return getResidueById(id);
	}

	values.push(id);
	await pool.execute(`UPDATE residuos SET ${fields.join(', ')} WHERE id = ?`, values);
	return getResidueById(id);
}

async function deleteResidue(id) {
	const [result] = await pool.execute('DELETE FROM residuos WHERE id = ?', [id]);
	return result.affectedRows > 0;
}

module.exports = {
	listResidues,
	getResidueById,
	listTypes,
	createResidue,
	updateResidue,
	deleteResidue
};
 
