import api from './axios.config';

async function listResidues() {
	const response = await api.get('/residuos');
	return response.data?.data || [];
}

async function listTypes() {
	const response = await api.get('/residuos/tipos');
	return response.data?.data || [];
}

async function getResidue(id) {
	const response = await api.get(`/residuos/${id}`);
	return response.data?.data;
}

async function createResidue(payload) {
	const response = await api.post('/residuos', payload);
	return response.data?.data;
}

async function updateResidue(id, payload) {
	const response = await api.put(`/residuos/${id}`, payload);
	return response.data?.data;
}

async function deleteResidue(id) {
	const response = await api.delete(`/residuos/${id}`);
	return response.data?.message || 'Residuo eliminado';
}

export default {
	listResidues,
	listTypes,
	getResidue,
	createResidue,
	updateResidue,
	deleteResidue
};
 
