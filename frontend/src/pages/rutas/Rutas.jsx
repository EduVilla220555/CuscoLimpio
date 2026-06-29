import { useEffect, useMemo, useRef, useState } from 'react';
import rutaApi from '../../api/ruta.api';
import zonaApi from '../../api/zona.api';
import usuarioApi from '../../api/usuario.api';
import useAuth from '../../hooks/useAuth';

const initialForm = {
	nombre: '',
	zona_id: '',
	operario_id: '',
	fecha_inicio: '',
	fecha_fin: '',
	estado: 'pendiente'
};

const states = [
	{ value: 'pendiente', label: 'Pendiente' },
	{ value: 'en_progreso', label: 'En progreso' },
	{ value: 'completada', label: 'Completada' }
];

// Route stops only — OSRM will compute the actual road-following path at runtime
const ROUTE_WAYPOINTS = {
	'Ruta Histórica Plaza': {
		stops: [
			{ latlng: [-13.5163, -71.9779], name: 'Plaza de Armas' },
			{ latlng: [-13.5172, -71.9773], name: 'Calle Loreto' },
			{ latlng: [-13.5193, -71.9767], name: 'Av. El Sol - Calle Loreto' },
			{ latlng: [-13.5191, -71.9790], name: 'Calle Maruri' },
		]
	},
	'Ruta San Cristóbal Alta': {
		stops: [
			{ latlng: [-13.5148, -71.9816], name: 'Resbalosa (inicio)' },
			{ latlng: [-13.5124, -71.9816], name: 'Pumacurco' },
			{ latlng: [-13.5115, -71.9828], name: 'Iglesia San Cristóbal' },
			{ latlng: [-13.5138, -71.9830], name: 'Bajada Don Bosco' },
		]
	},
	'Ruta Santa Ana Baja': {
		stops: [
			{ latlng: [-13.5198, -71.9847], name: 'Mercado San Pedro' },
			{ latlng: [-13.5219, -71.9870], name: 'Cuesta Santa Ana' },
			{ latlng: [-13.5235, -71.9865], name: 'Calle Meloc' },
			{ latlng: [-13.5215, -71.9840], name: 'Calle Arco' },
		]
	},
	'Ruta San Blas Artistas': {
		stops: [
			{ latlng: [-13.5163, -71.9776], name: 'Plaza de Armas NE' },
			{ latlng: [-13.5148, -71.9757], name: 'Cuesta San Blas' },
			{ latlng: [-13.5136, -71.9741], name: 'Plazoleta San Blas' },
			{ latlng: [-13.5120, -71.9720], name: 'Carmen Alto' },
		]
	},
	'Ruta Centro Comercial': {
		stops: [
			{ latlng: [-13.5197, -71.9817], name: 'Mercado San Pedro' },
			{ latlng: [-13.5193, -71.9790], name: 'Calle Maruri' },
			{ latlng: [-13.5193, -71.9765], name: 'Calle Maruri - El Sol' },
			{ latlng: [-13.5209, -71.9756], name: 'Av. El Sol Central' },
		]
	},
	'Ruta Santa Ana Residencial': {
		stops: [
			{ latlng: [-13.5197, -71.9817], name: 'Mercado San Pedro' },
			{ latlng: [-13.5220, -71.9858], name: 'Arcopata' },
			{ latlng: [-13.5238, -71.9877], name: 'Santa Ana Alta' },
			{ latlng: [-13.5248, -71.9862], name: 'Calle Kiskapata' },
		]
	},
	'Ruta Mirador Cristóbal': {
		stops: [
			{ latlng: [-13.5153, -71.9792], name: 'Calle Saphi' },
			{ latlng: [-13.5133, -71.9810], name: 'Camino a San Cristóbal' },
			{ latlng: [-13.5115, -71.9828], name: 'Mirador San Cristóbal' },
			{ latlng: [-13.5138, -71.9830], name: 'Retorno Don Bosco' },
		]
	},
	'Ruta Plazoleta San Blas': {
		stops: [
			{ latlng: [-13.5155, -71.9769], name: 'Calle Triunfo' },
			{ latlng: [-13.5148, -71.9757], name: 'Cuesta San Blas' },
			{ latlng: [-13.5136, -71.9741], name: 'Plazoleta San Blas' },
			{ latlng: [-13.5148, -71.9757], name: 'Regreso Cuesta San Blas' },
		]
	},
	'Ruta Histórica Nocturna': {
		stops: [
			{ latlng: [-13.5163, -71.9779], name: 'Plaza de Armas' },
			{ latlng: [-13.5153, -71.9792], name: 'Calle Saphi' },
			{ latlng: [-13.5175, -71.9800], name: 'Calle Santa Clara' },
			{ latlng: [-13.5191, -71.9790], name: 'Calle Maruri' },
		]
	},
};

// Fetch road-following path from OSRM public API (no API key needed)
async function fetchOSRMPath(stops, signal) {
	const waypoints = stops.map((s) => `${s.latlng[1]},${s.latlng[0]}`).join(';');
	try {
		const res = await fetch(
			`https://router.project-osrm.org/route/v1/foot/${waypoints}?overview=full&geometries=geojson`,
			{ signal }
		);
		const json = await res.json();
		if (json.code === 'Ok' && json.routes?.[0]?.geometry?.coordinates) {
			// OSRM returns [lon, lat] — Leaflet needs [lat, lon]
			return json.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
		}
	} catch (e) {
		if (e.name !== 'AbortError') console.warn('OSRM error, using fallback path:', e.message);
	}
	// Fallback: straight lines through stops
	return stops.map((s) => s.latlng);
}

function getRouteData(nombre) {
	return ROUTE_WAYPOINTS[nombre] || null;
}

export default function Rutas() {
	const { user } = useAuth();
	const isOperator = user?.role === 'operador';
	const canManageRoutes = !isOperator;
	const [items, setItems] = useState([]);
	const [zonas, setZonas] = useState([]);
	const [usuarios, setUsuarios] = useState([]);
	const [form, setForm] = useState(initialForm);
	const [editingId, setEditingId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');

	// Map & Timeline State
	const [selectedRouteId, setSelectedRouteId] = useState(null);
	const [leafletLoaded, setLeafletLoaded] = useState(false);
	const mapRef = useRef(null);
	const polylinesRef = useRef({});
	const markersRef = useRef({});  // stop markers per route id
	const mapInitializedRef = useRef(false);

	async function loadData() {
		setLoading(true);
		setError('');
		try {
			const [routes, zoneList, userList] = await Promise.all([
				rutaApi.listRoutes(),
				canManageRoutes ? zonaApi.listZones() : Promise.resolve([]),
				canManageRoutes ? usuarioApi.listUsers() : Promise.resolve([])
			]);
			setItems(routes);
			if (canManageRoutes) {
				setZonas(zoneList);
				setUsuarios(userList.filter((usuario) => usuario.role === 'operador' || usuario.role === 'supervisor' || usuario.role === 'admin'));
			}
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudieron cargar las rutas');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadData();
	}, []);

	// Load Leaflet dynamically
	useEffect(() => {
		if (!isOperator) return;
		if (window.L) {
			setLeafletLoaded(true);
			return;
		}

		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
		document.head.appendChild(link);

		const script = document.createElement('script');
		script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
		script.async = true;
		script.onload = () => {
			setLeafletLoaded(true);
		};
		document.head.appendChild(script);
	}, [isOperator]);

	const title = useMemo(() => (editingId ? 'Editar ruta' : 'Crear ruta'), [editingId]);
	const visibleItems = useMemo(() => {
		return isOperator ? items.filter((item) => Number(item.operario_id) === Number(user?.id)) : items;
	}, [isOperator, items, user?.id]);

	const timelineSteps = useMemo(() => {
		if (!selectedRouteId) return [];
		const route = visibleItems.find((item) => item.id === selectedRouteId);
		if (!route) return [];

		let streets = [];
		if (route.zona_nombre === 'Centro Histórico') {
			streets = ['Plaza de Armas', 'Calle Loreto', 'Calle Saphi', 'Calle Triunfo'];
		} else if (route.zona_nombre === 'San Blas') {
			streets = ['Carmen Alto', 'Tandapata', 'Siete Culebras', 'Cuesta de San Blas'];
		} else if (route.zona_nombre === 'San Cristóbal') {
			streets = ['Resbalosa', 'Pumacurco', 'Don Bosco', 'Cuesta del Almirante'];
		} else if (route.zona_nombre === 'Santa Ana') {
			streets = ['Cuesta de Santa Ana', 'Calle Meloc', 'Calle Abancay', 'Arco de Santa Ana'];
		} else {
			streets = ['Punto de Inicio', 'Sector A', 'Sector B', 'Punto de Descarga'];
		}

		return streets.map((street, idx) => {
			let time = '';
			if (idx === 0) time = '08:00';
			if (idx === 1) time = '08:45';
			if (idx === 2) time = '09:30';
			if (idx === 3) time = '10:15';

			return {
				title: idx === 0 ? 'Inicio de Ruta' : idx === streets.length - 1 ? 'Punto Final' : `Punto de Control ${idx}`,
				description: street,
				time: time,
				completed: route.estado === 'completada' || (route.estado === 'en_progreso' && idx < 2)
			};
		});
	}, [selectedRouteId, visibleItems]);

	// Initialize Map ONCE when Leaflet becomes available
	useEffect(() => {
		if (!isOperator || !leafletLoaded || mapInitializedRef.current) return;

		const mapContainer = document.getElementById('operator-routes-map');
		if (!mapContainer) return;

		// Clear any stale Leaflet marker on the DOM node (e.g. from HMR)
		if (mapContainer._leaflet_id) {
			mapContainer._leaflet_id = null;
		}

		const map = window.L.map(mapContainer).setView([-13.517, -71.979], 15);

		// OSM Mapnik tiles (same provider as Dashboard)
		const tileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 19
		}).addTo(map);

		// Apply same dark-invert filter as Dashboard map after tiles load
		tileLayer.on('load', () => {
			const tilePane = map.getPane('tilePane');
			if (tilePane) {
				tilePane.style.filter = 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)';
			}
		});
		// Apply immediately in case tiles already cached
		const tilePane = map.getPane('tilePane');
		if (tilePane) {
			tilePane.style.filter = 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)';
		}

		mapRef.current = map;
		mapInitializedRef.current = true;

		return () => {
			try { map.remove(); } catch (e) {}
			mapRef.current = null;
			mapInitializedRef.current = false;
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [leafletLoaded]);

	// Update route polylines + stop markers whenever visibleItems changes
	useEffect(() => {
		const map = mapRef.current;
		if (!map || visibleItems.length === 0) return;

		// Remove old polylines
		Object.values(polylinesRef.current).forEach((pl) => {
			try { map.removeLayer(pl); } catch (e) {}
		});
		// Remove old stop markers
		Object.values(markersRef.current).forEach((markerArr) => {
			markerArr.forEach((m) => { try { map.removeLayer(m); } catch (e) {} });
		});

		const polylines = {};
		const markers = {};
		const group = new window.L.FeatureGroup();

		const controller = new AbortController();

		const drawAll = async () => {
			for (const route of visibleItems) {
				if (controller.signal.aborted) return;

				const data = getRouteData(route.nombre);
				if (!data) continue;

				let color = '#5c6b66';
				if (route.estado === 'en_progreso') color = '#e8a020';
				if (route.estado === 'pendiente') color = '#c57f32';
				if (route.estado === 'completada') color = '#2563eb';

				// Fetch road-following path from OSRM
				const path = await fetchOSRMPath(data.stops, controller.signal);
				if (controller.signal.aborted) return;

				const polyline = window.L.polyline(path, {
					color: color,
					weight: 5,
					opacity: 0.92,
					lineJoin: 'round',
					lineCap: 'round'
				}).addTo(map);
				polyline.bindPopup(`<strong>${route.nombre}</strong><br>Estado: <em>${route.estado}</em>`);
				polylines[route.id] = polyline;
				group.addLayer(polyline);

				// Draw numbered stop markers
				const routeMarkers = data.stops.map((stop, idx) => {
					const isFirst = idx === 0;
					const isLast = idx === data.stops.length - 1;
					const markerColor = isFirst ? '#16a34a' : isLast ? '#dc2626' : color;
					const borderColor = isFirst ? '#14532d' : isLast ? '#7f1d1d' : '#1e293b';
					const label = isFirst ? '▶' : isLast ? '⬛' : `${idx + 1}`;

					const icon = window.L.divIcon({
						className: '',
						html: `<div style="width:26px;height:26px;background:${markerColor};border:2px solid ${borderColor};border-radius:50%;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.45);">${label}</div>`,
						iconSize: [26, 26],
						iconAnchor: [13, 13]
					});

					const marker = window.L.marker(stop.latlng, { icon }).addTo(map);
					marker.bindTooltip(`${idx + 1}. ${stop.name}`, {
						permanent: false, direction: 'top', offset: [0, -14]
					});
					group.addLayer(marker);
					return marker;
				});
				markers[route.id] = routeMarkers;
			}

			if (!controller.signal.aborted && group.getLayers().length > 0) {
				map.fitBounds(group.getBounds(), { padding: [40, 40] });
			}
			polylinesRef.current = polylines;
			markersRef.current = markers;
		};

		drawAll();
		return () => controller.abort();
	}, [visibleItems]);

	// Highlight polyline + markers when selectedRouteId changes
	useEffect(() => {
		const map = mapRef.current;
		const polylines = polylinesRef.current;
		if (!map || !polylines) return;

		// Reset all to their status color
		visibleItems.forEach((route) => {
			const polyline = polylines[route.id];
			if (polyline) {
				let color = '#5c6b66';
				if (route.estado === 'en_progreso') color = '#e8a020';
				if (route.estado === 'pendiente') color = '#c57f32';
				if (route.estado === 'completada') color = '#2563eb';
				polyline.setStyle({ color, weight: 5, opacity: 0.9 });
			}
		});

		if (selectedRouteId) {
			const activePolyline = polylines[selectedRouteId];
			if (activePolyline) {
				activePolyline.setStyle({ color: '#ef4444', weight: 8, opacity: 1.0 });
				activePolyline.openPopup();
				map.fitBounds(activePolyline.getBounds(), { padding: [50, 50], maxZoom: 17 });
			}
		}
	}, [selectedRouteId, visibleItems]);

	function handleChange(event) {
		const { name, value } = event.target;
		setForm((current) => ({ ...current, [name]: value }));
	}

	function startEdit(item) {
		setEditingId(item.id);
		setForm({
			nombre: item.nombre || '',
			zona_id: item.zona_id ?? '',
			operario_id: item.operario_id ?? '',
			fecha_inicio: item.fecha_inicio || '',
			fecha_fin: item.fecha_fin || '',
			estado: item.estado || 'pendiente'
		});
		setError('');
		setMessage('');
	}

	function resetForm() {
		setEditingId(null);
		setForm(initialForm);
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setSaving(true);
		setError('');
		setMessage('');
		try {
			const payload = {
				nombre: form.nombre,
				zona_id: form.zona_id === '' ? null : Number(form.zona_id),
				operario_id: form.operario_id === '' ? null : Number(form.operario_id),
				fecha_inicio: form.fecha_inicio || null,
				fecha_fin: form.fecha_fin || null,
				estado: form.estado
			};
			if (editingId) {
				await rutaApi.updateRoute(editingId, payload);
				setMessage('Ruta actualizada correctamente');
			} else {
				await rutaApi.createRoute(payload);
				setMessage('Ruta creada correctamente');
			}
			resetForm();
			await loadData();
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudo guardar la ruta');
		} finally {
			setSaving(false);
		}
	}

	async function handleDelete(id) {
		if (!confirm('¿Eliminar esta ruta?')) {
			return;
		}
		try {
			await rutaApi.deleteRoute(id);
			await loadData();
			setMessage('Ruta eliminada correctamente');
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudo eliminar la ruta');
		}
	}

	async function handleMarkAsCompleted(routeId) {
		setError('');
		setMessage('');
		try {
			await rutaApi.updateRoute(routeId, { estado: 'completada' });
			setMessage('Ruta completada correctamente');
			await loadData();
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudo completar la ruta');
		}
	}

	function handleViewRoute(routeId) {
		// Select the route (shows details + timeline)
		setSelectedRouteId(routeId);
		// Zoom into it on the map
		const polyline = polylinesRef.current[routeId];
		const map = mapRef.current;
		if (polyline && map) {
			// Reset all polylines first
			const currentItems = visibleItems;
			currentItems.forEach((route) => {
				const pl = polylinesRef.current[route.id];
				if (pl) {
					let color = '#5c6b66';
					if (route.estado === 'en_progreso') color = '#e8a020';
					if (route.estado === 'pendiente') color = '#c57f32';
					if (route.estado === 'completada') color = '#2563eb';
					try { pl.setStyle({ color, weight: 5, opacity: 0.9 }); } catch (e) {}
				}
			});
			// Highlight selected
			polyline.setStyle({ color: '#ef4444', weight: 8, opacity: 1.0 });
			polyline.openPopup();
			map.fitBounds(polyline.getBounds(), { padding: [50, 50], maxZoom: 17 });
		} else {
			document.getElementById('operator-routes-map')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	return (
		<section className="page-panel">
			<div className="section-heading">
				<p className="eyebrow">Módulo 3</p>
				<h2>Rutas</h2>
				<p>{isOperator ? 'Monitoreo de tus rutas asignadas en el distrito de Cusco.' : 'Planeación y seguimiento básico de rutas de recolección.'}</p>
			</div>
			<div className="panel-grid">
				{isOperator ? (
					<div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
						<article className="page-panel" style={{ display: 'flex', flexDirection: 'column' }}>
							<div className="section-heading compact">
								<p className="eyebrow">Mapa de recorrido</p>
								<h3>Visualización de rutas</h3>
							</div>
							<p style={{ marginBottom: '14px' }}>Tus rutas están dibujadas en el mapa. Haz clic en <strong>Ver ruta</strong> para enfocar un recorrido.</p>
							<div
								id="operator-routes-map"
								style={{
									width: '100%',
									height: '480px',
									borderRadius: '16px',
									border: '1px solid rgba(0,0,0,0.1)',
									overflow: 'hidden'
								}}
							>
								{!leafletLoaded ? <p style={{ padding: '20px', color: 'var(--muted)' }}>Cargando mapa...</p> : null}
							</div>
						</article>

						{selectedRouteId ? (
							(() => {
								const route = visibleItems.find((item) => item.id === selectedRouteId);
								if (!route) return null;
								return (
									<article className="page-panel" style={{ padding: '24px' }}>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
											<div>
												<p className="eyebrow" style={{ marginBottom: '4px' }}>{route.zona_nombre || 'Sin Zona'}</p>
												<h3 style={{ margin: 0 }}>{route.nombre}</h3>
											</div>
											{route.estado !== 'completada' ? (
												<button 
													className="primary-button" 
													type="button" 
													onClick={() => handleMarkAsCompleted(route.id)}
													style={{ padding: '10px 18px', fontSize: '0.9rem' }}
												>
													Marcar como completada
												</button>
											) : (
												<span style={{ 
													padding: '8px 14px', 
													borderRadius: '999px', 
													fontSize: '0.85rem', 
													fontWeight: 'bold', 
													background: 'rgba(32, 74, 135, 0.12)', 
													color: '#204a87' 
												}}>
													✓ Ruta Completada
												</span>
											)}
										</div>

										{error ? <div className="form-error" style={{ marginBottom: '14px' }}>{error}</div> : null}
										{message ? <div className="form-success" style={{ marginBottom: '14px' }}>{message}</div> : null}

										<div className="section-heading compact" style={{ marginTop: '20px', marginBottom: '12px' }}>
											<p className="eyebrow" style={{ color: 'var(--muted)' }}>Avance de la ruta</p>
											<h4 style={{ margin: 0, fontSize: '1.1rem' }}>Línea de tiempo</h4>
										</div>

										<div className="timeline-list" style={{ marginTop: '14px' }}>
											{timelineSteps.map((step, idx) => (
												<div className="timeline-item" key={idx} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
													{idx < timelineSteps.length - 1 && (
														<div style={{ 
															position: 'absolute', 
															left: '5px', 
															top: '20px', 
															bottom: '-14px', 
															width: '2px', 
															background: step.completed ? 'var(--accent)' : 'rgba(0,0,0,0.1)' 
														}} />
													)}
													<span className="timeline-dot" style={{ 
														width: '12px', 
														height: '12px', 
														background: step.completed ? 'var(--accent)' : 'rgba(0,0,0,0.15)',
														border: step.completed ? '2px solid white' : 'none',
														boxShadow: step.completed ? '0 0 0 2px var(--accent)' : 'none',
														zIndex: 2,
														marginTop: '6px'
													}} />
													<div style={{ flex: 1, paddingBottom: idx < timelineSteps.length - 1 ? '18px' : '0' }}>
														<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
															<strong style={{ fontSize: '0.95rem', color: step.completed ? 'var(--accent)' : 'var(--text)' }}>{step.title}</strong>
															<span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{step.time}</span>
														</div>
														<p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--muted)' }}>{step.description}</p>
													</div>
												</div>
											))}
										</div>
									</article>
								);
							})()
						) : (
							<article className="page-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)' }}>
								Selecciona una ruta en el listado para ver sus detalles y línea de tiempo.
							</article>
						)}
					</div>
				) : canManageRoutes ? (
					<article className="page-panel">
						<div className="section-heading compact">
							<p className="eyebrow">Formulario</p>
							<h3>{title}</h3>
						</div>
						<form className="stack" onSubmit={handleSubmit}>
							<label className="field"><span>Nombre</span><input name="nombre" value={form.nombre} onChange={handleChange} required /></label>
							<label className="field">
								<span>Zona</span>
								<select name="zona_id" value={form.zona_id} onChange={handleChange}>
									<option value="">Sin zona</option>
									{zonas.map((zona) => <option key={zona.id} value={zona.id}>{zona.nombre}</option>)}
								</select>
							</label>
							<label className="field">
								<span>Operador</span>
								<select name="operario_id" value={form.operario_id} onChange={handleChange}>
									<option value="">Sin operador</option>
									{usuarios.map((usuario) => <option key={usuario.id} value={usuario.id}>{usuario.nombre} ({usuario.role})</option>)}
								</select>
							</label>
							<label className="field"><span>Fecha inicio</span><input name="fecha_inicio" type="date" value={form.fecha_inicio} onChange={handleChange} /></label>
							<label className="field"><span>Fecha fin</span><input name="fecha_fin" type="date" value={form.fecha_fin} onChange={handleChange} /></label>
							<label className="field">
								<span>Estado</span>
								<select name="estado" value={form.estado} onChange={handleChange}>
									{states.map((state) => <option key={state.value} value={state.value}>{state.label}</option>)}
								</select>
							</label>
							{error ? <div className="form-error">{error}</div> : null}
							{message ? <div className="form-success">{message}</div> : null}
							<div className="form-actions">
								<button className="primary-button" type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
								{editingId ? <button className="ghost-button" type="button" onClick={resetForm}>Cancelar</button> : null}
							</div>
						</form>
					</article>
				) : null}

				<article className="page-panel">
					<div className="section-heading compact">
						<p className="eyebrow">Listado</p>
						<h3>{isOperator ? 'Mis rutas asignadas' : 'Rutas registradas'}</h3>
					</div>
					{loading ? <p>Cargando rutas...</p> : visibleItems.length === 0 ? <div className="empty-state">No hay rutas asignadas aún.</div> : (
						<div className="table-wrap">
							<table className="data-table">
								<thead>
									<tr>
										<th>Nombre</th>
										<th>Zona</th>
										<th>Estado</th>
										{isOperator ? <th></th> : null}
										{canManageRoutes ? <th>Operador</th> : null}
										{canManageRoutes ? <th>Acciones</th> : null}
									</tr>
								</thead>
								<tbody>
									{visibleItems.map((item) => (
										<tr 
											key={item.id}
											style={{ 
												cursor: isOperator ? 'pointer' : 'default',
												background: selectedRouteId === item.id ? 'rgba(15, 94, 79, 0.08)' : 'transparent',
												transition: 'background 0.2s ease'
											}}
											onClick={() => isOperator && setSelectedRouteId(item.id === selectedRouteId ? null : item.id)}
										>
											<td style={{ fontWeight: selectedRouteId === item.id ? 'bold' : 'normal' }}>{item.nombre}</td>
											<td>{item.zona_nombre || '-'}</td>
											<td>
												<span style={{ 
													padding: '4px 8px', 
													borderRadius: '999px', 
													fontSize: '0.8rem', 
													fontWeight: 'bold',
													background: item.estado === 'en_progreso' ? 'rgba(15, 94, 79, 0.12)' : item.estado === 'pendiente' ? 'rgba(197, 127, 50, 0.12)' : 'rgba(32, 74, 135, 0.12)',
													color: item.estado === 'en_progreso' ? '#0f5e4f' : item.estado === 'pendiente' ? '#c57f32' : '#204a87'
												}}>
													{item.estado === 'en_progreso' ? 'En progreso' : item.estado === 'pendiente' ? 'Pendiente' : 'Completada'}
												</span>
											</td>
											{canManageRoutes ? <td>{item.operario_nombre || '-'}</td> : null}
											{isOperator ? (
												<td style={{ whiteSpace: 'nowrap' }}>
													<button
														className="ghost-button"
														type="button"
														style={{
															display: 'inline-flex',
															alignItems: 'center',
															gap: '5px',
															fontSize: '0.82rem',
															padding: '4px 10px'
														}}
														onClick={(e) => { e.stopPropagation(); handleViewRoute(item.id); }}
													>
														<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
														Ver ruta
													</button>
												</td>
											) : null}
											{canManageRoutes ? (
												<td className="row-actions">
													<button className="ghost-button" type="button" onClick={(e) => { e.stopPropagation(); startEdit(item); }}>Editar</button>
													<button className="ghost-button danger" type="button" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}>Eliminar</button>
												</td>
											) : null}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</article>
			</div>
		</section>
	);
}
