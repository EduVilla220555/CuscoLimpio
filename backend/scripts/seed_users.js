// Script para crear usuarios de prueba: admin, supervisor, operador
require('dotenv').config();
const authService = require('../src/services/auth.service');

async function run() {
  try {
    const users = [
      { nombre: 'Admin Sistema', email: 'admin@cuscolimpio.local', password: 'Admin123!', role: 'admin' },
      { nombre: 'Supervisor Cusco', email: 'supervisor@cuscolimpio.local', password: 'Super123!', role: 'supervisor' },
      { nombre: 'Operador Prueba', email: 'operador@cuscolimpio.local', password: 'Operador123!', role: 'operador' }
    ];

    for (const u of users) {
      // Intentar crear, ignorar si ya existe
      const existing = await authService.findByEmail(u.email);
      if (existing) {
        console.log(`Usuario ya existe: ${u.email}`);
        continue;
      }
      const created = await authService.createUser(u);
      console.log(`Usuario creado: ${created.email || u.email} (id: ${created.id})`);
    }

    console.log('Seed de usuarios completado.');
    process.exit(0);
  } catch (err) {
    console.error('Error seed usuarios:', err.message || err);
    process.exit(1);
  }
}

run();
