import api from './axios.config';

async function listRoutes() {
	const response = await api.get('/rutas');
	return response.data?.data || [];
}

async function getRoute(id) {
	const response = await api.get(`/rutas/${id}`);
	return response.data?.data;
}

async function createRoute(payload) {
	const response = await api.post('/rutas', payload);
	return response.data?.data;
}

async function updateRoute(id, payload) {
	const response = await api.put(`/rutas/${id}`, payload);
	return response.data?.data;
}

async function deleteRoute(id) {
	const response = await api.delete(`/rutas/${id}`);
	return response.data?.message || 'Ruta eliminada';
}

export default {
	listRoutes,
	getRoute,
	createRoute,
	updateRoute,
	deleteRoute
};
 
