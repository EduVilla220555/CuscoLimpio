const mysql = require('mysql2/promise');
const config = require('./env');

// Pool de conexiones para MySQL
const pool = mysql.createPool(config.db);

// Si estamos en ambiente de test no forzamos la comprobación inicial
if (process.env.NODE_ENV !== 'test') {
  pool.getConnection()
    .then(connection => {
      console.log('✅ Conexión a MySQL establecida correctamente');
      connection.release();
    })
    .catch(error => {
      console.error('❌ Error al conectar a MySQL:', error.message);
      process.exit(1);
    });
} else {
  console.log('⚠️ NODE_ENV=test — omitida comprobación inicial de conexión a MySQL');
}

// Exportar pool para usar en modelos
module.exports = pool;
 
