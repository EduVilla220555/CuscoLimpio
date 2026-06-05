import api from './axios.config';

async function listUsers() {
	const response = await api.get('/usuarios');
	return response.data?.data || [];
}

async function getUser(id) {
	const response = await api.get(`/usuarios/${id}`);
	return response.data?.data;
}

async function createUser(payload) {
	const response = await api.post('/usuarios', payload);
	return response.data?.data;
}

async function updateUser(id, payload) {
	const response = await api.put(`/usuarios/${id}`, payload);
	return response.data?.data;
}

async function deleteUser(id) {
	const response = await api.delete(`/usuarios/${id}`);
	return response.data?.message || 'Usuario eliminado';
}

export default {
	listUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser
};
 
