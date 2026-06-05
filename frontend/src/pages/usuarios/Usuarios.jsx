import { useEffect, useMemo, useState } from 'react';
import usuarioApi from '../../api/usuario.api';

const initialForm = {
	nombre: '',
	email: '',
	password: '',
	role: 'operador'
};

const roles = [
	{ value: 'operador', label: 'Operador' },
	{ value: 'operario', label: 'Operario (legacy)' },
	{ value: 'supervisor', label: 'Supervisor' },
	{ value: 'admin', label: 'Administrador' }
];

export default function Usuarios() {
	const [users, setUsers] = useState([]);
	const [form, setForm] = useState(initialForm);
	const [editingId, setEditingId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');

	async function loadUsers() {
		setLoading(true);
		setError('');

		try {
			setUsers(await usuarioApi.listUsers());
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudieron cargar los usuarios');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadUsers();
	}, []);

	function handleChange(event) {
		const { name, value } = event.target;
		setForm((current) => ({ ...current, [name]: value }));
	}

	function startEdit(user) {
		setEditingId(user.id);
		setForm({ nombre: user.nombre, email: user.email, password: '', role: user.role || 'operador' });
		setMessage('');
		setError('');
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
			const payload = { ...form };
			if (!payload.password) {
				delete payload.password;
			}

			if (editingId) {
				await usuarioApi.updateUser(editingId, payload);
				setMessage('Usuario actualizado correctamente');
			} else {
				await usuarioApi.createUser(payload);
				setMessage('Usuario creado correctamente');
			}

			resetForm();
			await loadUsers();
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudo guardar el usuario');
		} finally {
			setSaving(false);
		}
	}

	async function handleDelete(id) {
		if (!confirm('¿Eliminar este usuario?')) {
			return;
		}

		try {
			await usuarioApi.deleteUser(id);
			await loadUsers();
			setMessage('Usuario eliminado correctamente');
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudo eliminar el usuario');
		}
	}

	const title = useMemo(() => (editingId ? 'Editar usuario' : 'Crear usuario'), [editingId]);

	return (
		<section className="page-panel">
			<div className="section-heading">
				<p className="eyebrow">Módulo 1</p>
				<h2>Usuarios</h2>
				<p>Gestión de cuentas para admin, supervisor y operador.</p>
			</div>

			<div className="panel-grid">
				<article className="page-panel">
					<div className="section-heading compact">
						<p className="eyebrow">Formulario</p>
						<h3>{title}</h3>
					</div>
					<form className="stack" onSubmit={handleSubmit}>
						<label className="field">
							<span>Nombre</span>
							<input name="nombre" value={form.nombre} onChange={handleChange} required />
						</label>
						<label className="field">
							<span>Email</span>
							<input name="email" type="email" value={form.email} onChange={handleChange} required />
						</label>
						<label className="field">
							<span>Contraseña {editingId ? '(dejar vacío si no cambia)' : ''}</span>
							<input name="password" type="password" value={form.password} onChange={handleChange} required={!editingId} />
						</label>
						<label className="field">
							<span>Rol</span>
							<select name="role" value={form.role} onChange={handleChange}>
								{roles.map((role) => (
									<option key={role.value} value={role.value}>{role.label}</option>
								))}
							</select>
						</label>
						<p className="hint-text">Los supervisores se crean desde el dashboard del administrador.</p>
						{error ? <div className="form-error">{error}</div> : null}
						{message ? <div className="form-success">{message}</div> : null}
						<div className="form-actions">
							<button className="primary-button" type="submit" disabled={saving}>
								{saving ? 'Guardando...' : 'Guardar'}
							</button>
							{editingId ? (
								<button className="ghost-button" type="button" onClick={resetForm}>Cancelar</button>
							) : null}
						</div>
					</form>
				</article>

				<article className="page-panel">
					<div className="section-heading compact">
						<p className="eyebrow">Listado</p>
						<h3>Usuarios registrados</h3>
					</div>
					{loading ? (
						<p>Cargando usuarios...</p>
					) : users.length === 0 ? (
						<div className="empty-state">No hay usuarios registrados aún.</div>
					) : (
						<div className="table-wrap">
							<table className="data-table">
								<thead>
									<tr>
										<th>Nombre</th>
										<th>Email</th>
										<th>Rol</th>
										<th>Acciones</th>
									</tr>
								</thead>
								<tbody>
									{users.map((user) => (
										<tr key={user.id}>
											<td>{user.nombre}</td>
											<td>{user.email}</td>
											<td>{user.role}</td>
											<td className="row-actions">
												<button className="ghost-button" type="button" onClick={() => startEdit(user)}>Editar</button>
												<button className="ghost-button danger" type="button" onClick={() => handleDelete(user.id)}>Eliminar</button>
											</td>
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
 
