-- 007_agregar_rol_operador.sql
-- Permitir el rol operador en usuarios existentes
ALTER TABLE usuarios
	MODIFY role ENUM('admin','supervisor','operador') NOT NULL DEFAULT 'operador';
