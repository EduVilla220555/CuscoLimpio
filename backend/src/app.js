const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const routes = require('./routes');

const app = express();

// ==================== MIDDLEWARE ====================

// CORS
app.use(cors(config.cors));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==================== RUTAS ====================

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API CuscoLimpio funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', routes);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// ==================== ERROR HANDLER ====================

app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Error interno del servidor';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(config.server.isDevelopment && { error: error.stack })
  });
});

module.exports = app;
 
