-- 007_agregar_rol_operador.sql
-- Permitir el rol operador en usuarios existentes
ALTER TABLE usuarios
\tMODIFY role ENUM('admin','supervisor','operador','operario') NOT NULL DEFAULT 'operador';
