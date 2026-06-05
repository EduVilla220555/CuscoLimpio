import api from './axios.config';

async function listAlerts() {
	const response = await api.get('/alertas');
	return response.data?.data || [];
}

async function getAlert(id) {
	const response = await api.get(`/alertas/${id}`);
	return response.data?.data;
}

async function createAlert(payload) {
	const response = await api.post('/alertas', payload);
	return response.data?.data;
}

async function updateAlert(id, payload) {
	const response = await api.put(`/alertas/${id}`, payload);
	return response.data?.data;
}

async function resolveAlert(id) {
	const response = await api.put(`/alertas/${id}/resolver`);
	return response.data?.data;
}

async function deleteAlert(id) {
	const response = await api.delete(`/alertas/${id}`);
	return response.data?.message || 'Alerta eliminada';
}

export default {
	listAlerts,
	getAlert,
	createAlert,
	updateAlert,
	resolveAlert,
	deleteAlert
};
 
