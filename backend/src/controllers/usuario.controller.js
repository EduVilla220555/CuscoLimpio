const userModel = require('../models/usuario.model');
const { hashPassword } = require('../utils/helpers');
const { sendJSON } = require('../utils/helpers');

const allowedRoles = new Set(['admin', 'supervisor', 'operador', 'operario']);

function normalizeRole(role) {
	return role || 'operador';
}

async function index(req, res, next) {
	try {
		const users = await userModel.listUsers();
		return sendJSON(res, 200, { success: true, data: users });
	} catch (error) {
		return next(error);
	}
}

async function show(req, res, next) {
	try {
		const user = await userModel.getUserById(req.params.id);

		if (!user) {
			return sendJSON(res, 404, { success: false, message: 'Usuario no encontrado' });
		}

		return sendJSON(res, 200, { success: true, data: user });
	} catch (error) {
		return next(error);
	}
}

async function store(req, res, next) {
	try {
		const { nombre, email, password, role } = req.body;

		if (!nombre || !email || !password) {
			return sendJSON(res, 400, { success: false, message: 'nombre, email y password son obligatorios' });
		}

		if (role && !allowedRoles.has(role)) {
			return sendJSON(res, 400, { success: false, message: 'Rol inválido' });
		}

		const hashedPassword = await hashPassword(password);
		const user = await userModel.createUser({
			nombre,
			email,
			password: hashedPassword,
			role: normalizeRole(role)
		});

		return sendJSON(res, 201, { success: true, message: 'Usuario creado correctamente', data: user });
	} catch (error) {
		if (error && error.code === 'ER_DUP_ENTRY') {
			return sendJSON(res, 409, { success: false, message: 'El correo ya está registrado' });
		}

		return next(error);
	}
}

async function update(req, res, next) {
	try {
		const payload = { ...req.body };

		if (payload.role && !allowedRoles.has(payload.role)) {
			return sendJSON(res, 400, { success: false, message: 'Rol inválido' });
		}

		if (payload.password) {
			payload.password = await hashPassword(payload.password);
		}

		const user = await userModel.updateUser(req.params.id, payload);

		if (!user) {
			return sendJSON(res, 404, { success: false, message: 'Usuario no encontrado' });
		}

		return sendJSON(res, 200, { success: true, message: 'Usuario actualizado correctamente', data: user });
	} catch (error) {
		if (error && error.code === 'ER_DUP_ENTRY') {
			return sendJSON(res, 409, { success: false, message: 'El correo ya está registrado' });
		}

		return next(error);
	}
}

async function destroy(req, res, next) {
	try {
		const deleted = await userModel.deleteUser(req.params.id);

		if (!deleted) {
			return sendJSON(res, 404, { success: false, message: 'Usuario no encontrado' });
		}

		return sendJSON(res, 200, { success: true, message: 'Usuario eliminado correctamente' });
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
 
