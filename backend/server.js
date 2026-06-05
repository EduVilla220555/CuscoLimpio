const app = require('./src/app');
const config = require('./src/config/env');

const PORT = config.server.port;

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Servidor CuscoLimpio ejecutándose en puerto ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: ${config.server.nodeEnv}`);
  console.log('\n✨ Sistema listo para recibir solicitudes\n');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n📌 SIGTERM recibida. Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado');
    process.exit(0);
  });
});
 
