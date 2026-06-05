const pool = require('../config/db');
const { sendJSON } = require('../utils/helpers');

async function daily(req, res, next) {
	try {
		const [rows] = await pool.execute(
			`SELECT DATE(fecha_registro) AS fecha, COUNT(*) AS residuos_total, COALESCE(SUM(peso), 0) AS peso_total
			 FROM residuos
			 WHERE DATE(fecha_registro) = CURDATE()
			 GROUP BY DATE(fecha_registro)`
		);

		const [routes] = await pool.execute(
			`SELECT estado, COUNT(*) AS total
			 FROM rutas
			 GROUP BY estado`
		);

		return sendJSON(res, 200, {
			success: true,
			data: {
				residuos: rows[0] || { fecha: new Date().toISOString().slice(0, 10), residuos_total: 0, peso_total: 0 },
				rutas: routes
			}
		});
	} catch (error) {
		return next(error);
	}
}

async function byZone(req, res, next) {
	try {
		const [rows] = await pool.execute(
			`SELECT z.id AS zona_id, z.nombre AS zona_nombre, COUNT(r.id) AS residuos_total, COALESCE(SUM(r.peso), 0) AS peso_total
			 FROM zonas z
			 LEFT JOIN residuos r ON r.zona_id = z.id
			 WHERE z.id = ?
			 GROUP BY z.id, z.nombre`,
			[req.params.zonaId]
		);

		if (!rows[0]) {
			return sendJSON(res, 404, { success: false, message: 'Zona no encontrada o sin datos' });
		}

		return sendJSON(res, 200, { success: true, data: rows[0] });
	} catch (error) {
		return next(error);
	}
}

async function byType(req, res, next) {
	try {
		const [rows] = await pool.execute(
			`SELECT tr.id AS tipo_id, tr.nombre AS tipo_nombre, COUNT(r.id) AS residuos_total, COALESCE(SUM(r.peso), 0) AS peso_total
			 FROM tipos_residuos tr
			 LEFT JOIN residuos r ON r.tipo_id = tr.id
			 WHERE tr.id = ?
			 GROUP BY tr.id, tr.nombre`,
			[req.params.tipoId]
		);

		if (!rows[0]) {
			return sendJSON(res, 404, { success: false, message: 'Tipo de residuo no encontrado o sin datos' });
		}

		return sendJSON(res, 200, { success: true, data: rows[0] });
	} catch (error) {
		return next(error);
	}
}

module.exports = { daily, byZone, byType };
 
