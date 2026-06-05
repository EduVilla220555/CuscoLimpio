-- seed_tipos_residuos.sql
INSERT INTO tipos_residuos (nombre, descripcion) VALUES
('Organico', 'Residuos biodegradables como restos de comida'),
('Reciclable', 'Plastico, vidrio, papel y metal reciclable'),
('No_Reciclable', 'Residuos que no se pueden reciclar'),
('Peligroso', 'Residuos peligrosos que requieren manejo especial')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

 
