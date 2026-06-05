const express = require('express');
const authRoutes = require('./auth.routes');
const usuarioRoutes = require('./usuario.routes');
const zonaRoutes = require('./zona.routes');
const residuoRoutes = require('./residuo.routes');
const rutaRoutes = require('./ruta.routes');
const alertaRoutes = require('./alerta.routes');
const reporteRoutes = require('./reporte.routes');

const router = express.Router();

// API root
router.get('/', (req, res) => {
	res.json({ success: true, message: 'API CuscoLimpio - endpoints: /auth, /usuarios, /zonas, /residuos, /rutas, /alertas, /reportes' });
});

router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/zonas', zonaRoutes);
router.use('/residuos', residuoRoutes);
router.use('/rutas', rutaRoutes);
router.use('/alertas', alertaRoutes);
router.use('/reportes', reporteRoutes);

module.exports = router;
 
