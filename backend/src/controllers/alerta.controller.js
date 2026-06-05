const alertaModel = require('../models/alerta.model');
const { sendJSON } = require('../utils/helpers');

async function index(req, res, next) {
	try {
		const alerts = await alertaModel.listAlerts();
		return sendJSON(res, 200, { success: true, data: alerts });
	} catch (error) {
		return next(error);
	}
}

async function show(req, res, next) {
	try {
		const alert = await alertaModel.getAlertById(req.params.id);
		if (!alert) {
			return sendJSON(res, 404, { success: false, message: 'Alerta no encontrada' });
		}
		return sendJSON(res, 200, { success: true, data: alert });
	} catch (error) {
		return next(error);
	}
}

async function store(req, res, next) {
	try {
		const { tipo, descripcion, zona_id = null, ruta_id = null, usuario_id = null, estado = 'abierta' } = req.body;
		if (!tipo || !descripcion) {
			return sendJSON(res, 400, { success: false, message: 'tipo y descripcion son obligatorios' });
		}
		const alert = await alertaModel.createAlert({ tipo, descripcion, zona_id, ruta_id, usuario_id, estado });
		return sendJSON(res, 201, { success: true, message: 'Alerta creada correctamente', data: alert });
	} catch (error) {
		return next(error);
	}
}

async function update(req, res, next) {
	try {
		const { tipo, descripcion, zona_id = null, ruta_id = null, usuario_id = null, estado = 'abierta' } = req.body;
		if (!tipo || !descripcion) {
			return sendJSON(res, 400, { success: false, message: 'tipo y descripcion son obligatorios' });
		}
		const alert = await alertaModel.updateAlert(req.params.id, { tipo, descripcion, zona_id, ruta_id, usuario_id, estado });
		if (!alert) {
			return sendJSON(res, 404, { success: false, message: 'Alerta no encontrada' });
		}
		return sendJSON(res, 200, { success: true, message: 'Alerta actualizada correctamente', data: alert });
	} catch (error) {
		return next(error);
	}
}

async function resolve(req, res, next) {
	try {
		const alert = await alertaModel.resolveAlert(req.params.id);
		if (!alert) {
			return sendJSON(res, 404, { success: false, message: 'Alerta no encontrada' });
		}
		return sendJSON(res, 200, { success: true, message: 'Alerta resuelta correctamente', data: alert });
	} catch (error) {
		return next(error);
	}
}

async function destroy(req, res, next) {
	try {
		const deleted = await alertaModel.deleteAlert(req.params.id);
		if (!deleted) {
			return sendJSON(res, 404, { success: false, message: 'Alerta no encontrada' });
		}
		return sendJSON(res, 200, { success: true, message: 'Alerta eliminada correctamente' });
	} catch (error) {
		return next(error);
	}
}

module.exports = { index, show, store, update, resolve, destroy };
 
