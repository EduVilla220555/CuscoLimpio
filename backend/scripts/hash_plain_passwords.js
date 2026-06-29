const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function run() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Buscando usuarios con contraseñas en texto plano...');
    const [users] = await connection.query('SELECT id, email, password FROM usuarios');

    for (const u of users) {
      if (!u.password.startsWith('$2b$') && !u.password.startsWith('$2a$')) {
        const hashed = await hashPassword(u.password);
        await connection.query('UPDATE usuarios SET password = ? WHERE id = ?', [hashed, u.id]);
        console.log(`Contraseña hasheada y actualizada para: ${u.email}`);
      } else {
        console.log(`Contraseña ya está encriptada para: ${u.email}`);
      }
    }

    console.log('Proceso de hasheo de contraseñas completado.');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Error al hashear las contraseñas:', error);
    if (connection) await connection.end();
    process.exit(1);
  }
}

run();
