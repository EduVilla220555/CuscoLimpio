import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Register() {
	const navigate = useNavigate();
	const { register } = useAuth();
	const [form, setForm] = useState({ nombre: '', email: '', password: '' });
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);

	function handleChange(event) {
		const { name, value } = event.target;
		setForm((current) => ({ ...current, [name]: value }));
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setLoading(true);
		setError('');
		setMessage('');

		try {
			await register(form);
			setMessage('Usuario registrado correctamente. Ya puedes iniciar sesión.');
			setTimeout(() => navigate('/login', { replace: true }), 700);
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudo registrar el usuario');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="auth-layout register-layout">
			<section className="auth-hero register-hero">
				<div className="hero-badge">Fase de usuarios</div>
				<h1>Alta de ciudadanos y personal operativo</h1>
				<p>El registro prepara la base de usuarios para las rutas, alertas y reportes del distrito de Cusco.</p>
			</section>
			<section className="auth-card">
				<div className="section-heading compact">
					<p className="eyebrow">Nuevo usuario</p>
					<h2>Crear cuenta</h2>
					<p>Este registro público crea solo cuentas de operador. Los supervisores los crea un administrador.</p>
				</div>
				<form className="stack" onSubmit={handleSubmit}>
					<label className="field">
						<span>Nombre completo</span>
						<input name="nombre" type="text" value={form.nombre} onChange={handleChange} placeholder="María Quispe" required />
					</label>
					<label className="field">
						<span>Correo</span>
						<input name="email" type="email" value={form.email} onChange={handleChange} placeholder="maria@cuscolimpio.pe" required />
					</label>
					<label className="field">
						<span>Contraseña</span>
						<input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
					</label>
					<label className="field">
						<span>Rol</span>
						<input value="Operador" disabled readOnly />
					</label>
					{error ? <div className="form-error">{error}</div> : null}
					{message ? <div className="form-success">{message}</div> : null}
					<button className="primary-button" type="submit" disabled={loading}>
						{loading ? 'Registrando...' : 'Crear usuario'}
					</button>
				</form>
				<p className="auth-footer">
					¿Ya tienes cuenta? <Link to="/login">Volver al ingreso</Link>
				</p>
			</section>
		</div>
	);
} 
