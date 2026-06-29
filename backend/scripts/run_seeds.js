const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { execSync } = require('child_process');
require('dotenv').config();

async function executeSqlFile(connection, relativePath) {
  const filePath = path.resolve(__dirname, '../../', relativePath);
  console.log(`Ejecutando SQL: ${relativePath}`);
  const sql = fs.readFileSync(filePath, 'utf8');
  await connection.query(sql);
  console.log(`✅ Completado: ${relativePath}`);
}

async function run() {
  let connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  });

  try {
    // 0. Crear base de datos si no existe (haciendo drop primero para un inicio limpio y sin duplicados)
    console.log(`Recreando base de datos ${process.env.DB_NAME} para un estado limpio...`);
    await connection.query(`DROP DATABASE IF EXISTS \`${process.env.DB_NAME}\`;`);
    await connection.query(`CREATE DATABASE \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${process.env.DB_NAME}\`;`);
    console.log(`✅ Base de datos seleccionada: ${process.env.DB_NAME}`);

    // 1. Ejecutar el esquema principal
    await executeSqlFile(connection, 'database/schema.sql');

    // 2. Zonas
    await executeSqlFile(connection, 'database/seeds/seed_zonas.sql');

    // 3. Tipos de residuos
    await executeSqlFile(connection, 'database/seeds/seed_tipos_residuos.sql');

    // 4. Usuarios de prueba (ejecutando seed_users.js como subproceso)
    console.log('Ejecutando seed de usuarios...');
    execSync('node "' + path.join(__dirname, 'seed_users.js') + '"', { stdio: 'inherit' });
    console.log('✅ Usuarios sembrados.');

    // 5. Rutas (depende de zonas y usuarios)
    await executeSqlFile(connection, 'database/seeds/seed_rutas.sql');

    // 6. Alertas (depende de rutas y usuarios)
    await executeSqlFile(connection, 'database/seeds/seed_alertas.sql');

    // 7. Residuos (depende de tipos_residuos, zonas y usuarios)
    await executeSqlFile(connection, 'database/seeds/seed_residuos.sql');

    console.log('🎉 Todos los datos de prueba y la base de datos han sido inicializados correctamente.');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sembrar los datos de prueba:', error);
    try {
      if (connection) await connection.end();
    } catch (err) {}
    process.exit(1);
  }
}

run();
