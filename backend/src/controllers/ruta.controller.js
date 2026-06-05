const rutaModel = require('../models/ruta.model');
const { sendJSON } = require('../utils/helpers');

const validStates = new Set(['pendiente', 'en_progreso', 'completada']);

async function index(req, res, next) {
	try {
		const routes = await rutaModel.listRoutes();
		return sendJSON(res, 200, { success: true, data: routes });
	} catch (error) {
		return next(error);
	}
}

async function show(req, res, next) {
	try {
		const route = await rutaModel.getRouteById(req.params.id);
		if (!route) {
			return sendJSON(res, 404, { success: false, message: 'Ruta no encontrada' });
		}
		return sendJSON(res, 200, { success: true, data: route });
	} catch (error) {
		return next(error);
	}
}

async function store(req, res, next) {
	try {
		const { nombre, zona_id = null, operario_id = null, fecha_inicio = null, fecha_fin = null, estado = 'pendiente' } = req.body;
		if (!nombre) {
			return sendJSON(res, 400, { success: false, message: 'nombre es obligatorio' });
		}
		if (!validStates.has(estado)) {
			return sendJSON(res, 400, { success: false, message: 'Estado inválido' });
		}
		const route = await rutaModel.createRoute({ nombre, zona_id, operario_id, fecha_inicio, fecha_fin, estado });
		return sendJSON(res, 201, { success: true, message: 'Ruta creada correctamente', data: route });
	} catch (error) {
		return next(error);
	}
}

async function update(req, res, next) {
	try {
		if (req.body.estado && !validStates.has(req.body.estado)) {
			return sendJSON(res, 400, { success: false, message: 'Estado inválido' });
		}
		const route = await rutaModel.updateRoute(req.params.id, req.body);
		if (!route) {
			return sendJSON(res, 404, { success: false, message: 'Ruta no encontrada' });
		}
		return sendJSON(res, 200, { success: true, message: 'Ruta actualizada correctamente', data: route });
	} catch (error) {
		return next(error);
	}
}

async function destroy(req, res, next) {
	try {
		const deleted = await rutaModel.deleteRoute(req.params.id);
		if (!deleted) {
			return sendJSON(res, 404, { success: false, message: 'Ruta no encontrada' });
		}
		return sendJSON(res, 200, { success: true, message: 'Ruta eliminada correctamente' });
	} catch (error) {
		return next(error);
	}
}

module.exports = { index, show, store, update, destroy };
 
