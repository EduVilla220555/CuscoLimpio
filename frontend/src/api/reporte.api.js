import api from './axios.config';

async function dailyReport() {
	const response = await api.get('/reportes/diarios');
	return response.data?.data;
}

async function zoneReport(zonaId) {
	const response = await api.get(`/reportes/zona/${zonaId}`);
	return response.data?.data;
}

async function typeReport(tipoId) {
	const response = await api.get(`/reportes/tipo/${tipoId}`);
	return response.data?.data;
}

export default {
	dailyReport,
	zoneReport,
	typeReport
};
 
