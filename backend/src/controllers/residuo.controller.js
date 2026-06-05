const residuoModel = require('../models/residuo.model');
const { sendJSON } = require('../utils/helpers');

async function index(req, res, next) {
	try {
		const residues = await residuoModel.listResidues();
		return sendJSON(res, 200, { success: true, data: residues });
	} catch (error) {
		return next(error);
	}
}

async function types(req, res, next) {
	try {
		const tipos = await residuoModel.listTypes();
		return sendJSON(res, 200, { success: true, data: tipos });
	} catch (error) {
		return next(error);
	}
}

async function show(req, res, next) {
	try {
		const residue = await residuoModel.getResidueById(req.params.id);
		if (!residue) {
			return sendJSON(res, 404, { success: false, message: 'Residuo no encontrado' });
		}
		return sendJSON(res, 200, { success: true, data: residue });
	} catch (error) {
		return next(error);
	}
}

async function store(req, res, next) {
	try {
		const { tipo_id, descripcion = null, peso = 0, zona_id = null, usuario_id = null } = req.body;
		if (!tipo_id) {
			return sendJSON(res, 400, { success: false, message: 'tipo_id es obligatorio' });
		}
		const residue = await residuoModel.createResidue({ tipo_id, descripcion, peso, zona_id, usuario_id });
		return sendJSON(res, 201, { success: true, message: 'Residuo registrado correctamente', data: residue });
	} catch (error) {
		return next(error);
	}
}

async function update(req, res, next) {
	try {
		const residue = await residuoModel.updateResidue(req.params.id, req.body);
		if (!residue) {
			return sendJSON(res, 404, { success: false, message: 'Residuo no encontrado' });
		}
		return sendJSON(res, 200, { success: true, message: 'Residuo actualizado correctamente', data: residue });
	} catch (error) {
		return next(error);
	}
}

async function destroy(req, res, next) {
	try {
		const deleted = await residuoModel.deleteResidue(req.params.id);
		if (!deleted) {
			return sendJSON(res, 404, { success: false, message: 'Residuo no encontrado' });
		}
		return sendJSON(res, 200, { success: true, message: 'Residuo eliminado correctamente' });
	} catch (error) {
		return next(error);
	}
}

module.exports = { index, types, show, store, update, destroy };
 
