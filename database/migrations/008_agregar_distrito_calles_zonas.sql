-- 008_agregar_distrito_calles_zonas.sql
-- Agregar columnas distrito y calles_recorrer a la tabla zonas

ALTER TABLE zonas 
ADD COLUMN distrito VARCHAR(100) AFTER descripcion,
ADD COLUMN calles_recorrer TEXT AFTER distrito;
