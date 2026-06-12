CREATE DATABASE IF NOT EXISTS cusco_limpio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'cusco_app'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_contraseña_mysql';
ALTER USER 'cusco_app'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_contraseña_mysql';
GRANT ALL PRIVILEGES ON cusco_limpio.* TO 'cusco_app'@'localhost';
FLUSH PRIVILEGES;

USE cusco_limpio;
SOURCE database/schema.sql;
SOURCE database/migrations/001_crear_usuarios.sql;
SOURCE database/migrations/002_crear_zonas.sql;
SOURCE database/migrations/003_crear_residuos.sql;
SOURCE database/migrations/004_crear_rutas.sql;
SOURCE database/migrations/005_crear_alertas.sql;
SOURCE database/migrations/006_crear_reportes.sql;
SOURCE database/seeds/seed_zonas.sql;
SOURCE database/seeds/seed_tipos_residuos.sql;
