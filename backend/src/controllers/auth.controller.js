const authService = require('../services/auth.service');
const jwtUtil = require('../utils/jwt');
const { sendJSON } = require('../utils/helpers');

async function register(req, res, next) {
	try {
		const { nombre, email, password } = req.body;

		if (!nombre || !email || !password) {
			return sendJSON(res, 400, {
				success: false,
				message: 'nombre, email y password son obligatorios'
			});
		}

		const user = await authService.createUser({ nombre, email, password, role: 'operador' });

		return sendJSON(res, 201, {
			success: true,
			message: 'Usuario registrado correctamente',
			data: user
		});
	} catch (error) {
		if (error && error.code === 'ER_DUP_ENTRY') {
			return sendJSON(res, 409, {
				success: false,
				message: 'El correo ya está registrado'
			});
		}

		return next(error);
	}
}

async function createSupervisor(req, res, next) {
	try {
		if (!req.user || req.user.role !== 'admin') {
			return sendJSON(res, 403, {
				success: false,
				message: 'Solo un administrador puede crear supervisores'
			});
		}

		const { nombre, email, password } = req.body;

		if (!nombre || !email || !password) {
			return sendJSON(res, 400, {
				success: false,
				message: 'nombre, email y password son obligatorios'
			});
		}

		const user = await authService.createUser({ nombre, email, password, role: 'supervisor' });

		return sendJSON(res, 201, {
			success: true,
			message: 'Supervisor creado correctamente',
			data: user
		});
	} catch (error) {
		if (error && error.code === 'ER_DUP_ENTRY') {
			return sendJSON(res, 409, {
				success: false,
				message: 'El correo ya está registrado'
			});
		}

		return next(error);
	}
}

async function login(req, res, next) {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return sendJSON(res, 400, {
				success: false,
				message: 'email y password son obligatorios'
			});
		}

		const result = await authService.authenticate(email, password);

		if (!result) {
			return sendJSON(res, 401, {
				success: false,
				message: 'Credenciales inválidas'
			});
		}

		return sendJSON(res, 200, {
			success: true,
			message: 'Inicio de sesión exitoso',
			data: result
		});
	} catch (error) {
		return next(error);
	}
}

async function logout(req, res) {
	return sendJSON(res, 200, {
		success: true,
		message: 'Sesión cerrada correctamente'
	});
}

async function refresh(req, res, next) {
	try {
		const header = req.headers.authorization || req.headers.Authorization;
		const token = header && header.startsWith('Bearer ') ? header.split(' ')[1] : req.body.token;

		if (!token) {
			return sendJSON(res, 401, {
				success: false,
				message: 'Token requerido'
			});
		}

		const payload = jwtUtil.verify(token);
		const newToken = jwtUtil.sign({ id: payload.id, role: payload.role });

		return sendJSON(res, 200, {
			success: true,
			message: 'Token renovado correctamente',
			data: { token: newToken }
		});
	} catch (error) {
		return next(error);
	}
}

module.exports = {
	register,
	createSupervisor,
	login,
	logout,
	refresh
};
 
