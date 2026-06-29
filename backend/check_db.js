const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        console.log("Intentando conectar a MySQL...");
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'password123',
            multipleStatements: true
        });

        console.log("Conectado a MySQL.");
        await connection.query(`CREATE DATABASE IF NOT EXISTS cusco_limpio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log("Base de datos asegurada.");
        
        await connection.query(`USE cusco_limpio;`);

        // Cargar el schema
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
        await connection.query(schemaSQL);
        console.log("Schema ejecutado.");

        // Cargar migraciones
        const migrationsDir = path.join(__dirname, '../database/migrations');
        const migrations = fs.readdirSync(migrationsDir).sort();
        for (const file of migrations) {
            if (file.endsWith('.sql')) {
                const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
                await connection.query(sql);
                console.log(`Migración ejecutada: ${file}`);
            }
        }

        // Cargar seeds
        const seedsDir = path.join(__dirname, '../database/seeds');
        const seeds = fs.readdirSync(seedsDir).sort();
        for (const file of seeds) {
            if (file.endsWith('.sql')) {
                const sql = fs.readFileSync(path.join(seedsDir, file), 'utf8');
                await connection.query(sql);
                console.log(`Seed ejecutado: ${file}`);
            }
        }

        await connection.end();
        console.log("Todo listo.");
    } catch (error) {
        console.error("Error al configurar BD:", error.message);
        process.exit(1);
    }
}

main();
