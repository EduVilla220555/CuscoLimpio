CREATE DATABASE IF NOT EXISTS cusco_limpio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'cusco_app'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_contraseña_mysql';
ALTER USER 'cusco_app'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_contraseña_mysql';
GRANT ALL PRIVILEGES ON cusco_limpio.* TO 'cusco_app'@'localhost';
FLUSH PRIVILEGES;

USE cusco_limpio;

-- Cargar la estructura completa actualizada
SOURCE database/schema.sql;

-- Cargar todos los datos de prueba (seeds) de Cusco
SOURCE database/seeds/seed_zonas.sql;
SOURCE database/seeds/seed_tipos_residuos.sql;
SOURCE database/seeds/seed_rutas.sql;
SOURCE database/seeds/seed_alertas.sql;
SOURCE database/seeds/seed_residuos.sql;

