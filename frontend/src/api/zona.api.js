import api from './axios.config';

async function listZones() {
	const response = await api.get('/zonas');
	return response.data?.data || [];
}

async function getZone(id) {
	const response = await api.get(`/zonas/${id}`);
	return response.data?.data;
}

async function createZone(payload) {
	const response = await api.post('/zonas', payload);
	return response.data?.data;
}

async function updateZone(id, payload) {
	const response = await api.put(`/zonas/${id}`, payload);
	return response.data?.data;
}

async function deleteZone(id) {
	const response = await api.delete(`/zonas/${id}`);
	return response.data?.message || 'Zona eliminada';
}

export default {
	listZones,
	getZone,
	createZone,
	updateZone,
	deleteZone
};
 
