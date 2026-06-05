import { useEffect, useState } from 'react';
import reporteApi from '../../api/reporte.api';
import zonaApi from '../../api/zona.api';
import residuoApi from '../../api/residuo.api';

export default function Reportes() {
	const [daily, setDaily] = useState(null);
	const [zonaId, setZonaId] = useState('');
	const [tipoId, setTipoId] = useState('');
	const [zonaReport, setZonaReport] = useState(null);
	const [typeReport, setTypeReport] = useState(null);
	const [zonas, setZonas] = useState([]);
	const [tipos, setTipos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	async function loadInitial() {
		setLoading(true);
		setError('');
		try {
			const [dailyData, zoneList, typeList] = await Promise.all([
				reporteApi.dailyReport(),
				zonaApi.listZones(),
				residuoApi.listTypes()
			]);
			setDaily(dailyData);
			setZonas(zoneList);
			setTipos(typeList);
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudieron cargar los reportes');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadInitial();
	}, []);

	async function handleZoneReport() {
		if (!zonaId) return;
		try {
			setZonaReport(await reporteApi.zoneReport(zonaId));
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudo cargar el reporte por zona');
		}
	}

	async function handleTypeReport() {
		if (!tipoId) return;
		try {
			setTypeReport(await reporteApi.typeReport(tipoId));
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudo cargar el reporte por tipo');
		}
	}

	return (
		<section className="page-panel">
			<div className="section-heading">
				<p className="eyebrow">Módulo 6</p>
				<h2>Reportes y analítica</h2>
				<p>Indicadores básicos para toma de decisiones operativas.</p>
			</div>
			{error ? <div className="form-error">{error}</div> : null}
			{loading ? <p>Cargando reportes...</p> : (
				<div className="panel-grid">
					<article className="page-panel">
						<div className="section-heading compact">
							<p className="eyebrow">Resumen diario</p>
							<h3>Hoy</h3>
						</div>
						<div className="stats-grid">
							<article className="metric-card"><span>Residuos</span><strong>{daily?.residuos?.residuos_total ?? 0}</strong><p>Registrados hoy</p></article>
							<article className="metric-card"><span>Peso total</span><strong>{daily?.residuos?.peso_total ?? 0}</strong><p>Kilogramos acumulados</p></article>
						</div>
						<div className="empty-state" style={{ marginTop: '16px' }}>
							{Array.isArray(daily?.rutas) && daily.rutas.length > 0
								? daily.rutas.map((row) => `${row.estado}: ${row.total}`).join(' | ')
								: 'No hay rutas registradas en el resumen diario.'}
						</div>
					</article>

					<article className="page-panel">
						<div className="section-heading compact">
							<p className="eyebrow">Reporte por zona</p>
							<h3>Consultar zona</h3>
						</div>
						<div className="stack">
							<label className="field">
								<span>Zona</span>
								<select value={zonaId} onChange={(event) => setZonaId(event.target.value)}>
									<option value="">Seleccionar</option>
									{zonas.map((zona) => <option key={zona.id} value={zona.id}>{zona.nombre}</option>)}
								</select>
							</label>
							<button className="primary-button" type="button" onClick={handleZoneReport}>Generar reporte</button>
						</div>
						<div className="empty-state">{zonaReport ? `${zonaReport.zona_nombre}: ${zonaReport.residuos_total} residuos, ${zonaReport.peso_total} kg` : 'Selecciona una zona para ver el detalle.'}</div>
					</article>

					<article className="page-panel">
						<div className="section-heading compact">
							<p className="eyebrow">Reporte por tipo</p>
							<h3>Consultar tipo</h3>
						</div>
						<div className="stack">
							<label className="field">
								<span>Tipo de residuo</span>
								<select value={tipoId} onChange={(event) => setTipoId(event.target.value)}>
									<option value="">Seleccionar</option>
									{tipos.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>)}
								</select>
							</label>
							<button className="primary-button" type="button" onClick={handleTypeReport}>Generar reporte</button>
						</div>
						<div className="empty-state">{typeReport ? `${typeReport.tipo_nombre}: ${typeReport.residuos_total} residuos, ${typeReport.peso_total} kg` : 'Selecciona un tipo para ver el detalle.'}</div>
					</article>
				</div>
			)}
		</section>
	);
} 
