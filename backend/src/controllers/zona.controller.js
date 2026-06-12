const zoneModel = require('../models/zona.model');
const { sendJSON } = require('../utils/helpers');

async function index(req, res, next) {
	try {
		const zones = await zoneModel.listZones();
		return sendJSON(res, 200, { success: true, data: zones });
	} catch (error) {
		return next(error);
	}
}

async function show(req, res, next) {
	try {
		const zone = await zoneModel.getZoneById(req.params.id);

		if (!zone) {
			return sendJSON(res, 404, { success: false, message: 'Zona no encontrada' });
		}

		return sendJSON(res, 200, { success: true, data: zone });
	} catch (error) {
		return next(error);
	}
}

async function store(req, res, next) {
	try {
		const { nombre, descripcion = null, distrito = null, calles_recorrer = null, centro_lat = null, centro_lng = null } = req.body;

		if (!nombre) {
			return sendJSON(res, 400, { success: false, message: 'nombre es obligatorio' });
		}

		const zone = await zoneModel.createZone({ nombre, descripcion, distrito, calles_recorrer, centro_lat, centro_lng });
		return sendJSON(res, 201, { success: true, message: 'Zona creada correctamente', data: zone });
	} catch (error) {
		if (error && error.code === 'ER_DUP_ENTRY') {
			return sendJSON(res, 409, { success: false, message: 'El nombre de la zona ya existe' });
		}

		return next(error);
	}
}

async function update(req, res, next) {
	try {
		const zone = await zoneModel.updateZone(req.params.id, req.body);

		if (!zone) {
			return sendJSON(res, 404, { success: false, message: 'Zona no encontrada' });
		}

		return sendJSON(res, 200, { success: true, message: 'Zona actualizada correctamente', data: zone });
	} catch (error) {
		if (error && error.code === 'ER_DUP_ENTRY') {
			return sendJSON(res, 409, { success: false, message: 'El nombre de la zona ya existe' });
		}

		return next(error);
	}
}

async function destroy(req, res, next) {
	try {
		const deleted = await zoneModel.deleteZone(req.params.id);

		if (!deleted) {
			return sendJSON(res, 404, { success: false, message: 'Zona no encontrada' });
		}

		return sendJSON(res, 200, { success: true, message: 'Zona eliminada correctamente' });
	} catch (error) {
		return next(error);
	}
}

module.exports = {
	index,
	show,
	store,
	update,
	destroy
};
 
