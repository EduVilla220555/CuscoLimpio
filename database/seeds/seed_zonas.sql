-- seed_zonas.sql
-- Zonas representativas de todo el Distrito de Cusco
INSERT INTO zonas (nombre, descripcion, distrito, calles_recorrer, centro_lat, centro_lng) VALUES
('Centro Histórico Principal', 'Plaza de Armas y alrededores inmediatos', 'Cusco', 'Plaza de Armas, Loreto, Portal Panes, Triunfo, Santa Catalina', -13.516667, -71.978333),
('Barrio de San Blas', 'Barrio artesanal de Cusco', 'Cusco', 'Carmen Alto, Tandapata, Siete Culebras, Cuesta de San Blas', -13.518200, -71.977500),
('San Cristóbal y Saphy', 'Zona elevada norte y bajada principal', 'Cusco', 'Resbalosa, Pumacurco, Don Bosco, Calle Saphy', -13.515000, -71.983000),
('Santa Ana', 'Barrio tradicional noroccidente', 'Cusco', 'Cuesta de Santa Ana, Calle Meloc, Calle Abancay, Arcopata', -13.518000, -71.989000),
('Eje Av. El Sol y Qoricancha', 'Zona comercial y monumental', 'Cusco', 'Av. El Sol, Santo Domingo, Pampa del Castillo, Arrayan, Av. Tullumayo', -13.521500, -71.973600),
('Mercado San Pedro', 'Zona de alto tránsito y comercio', 'Cusco', 'Cascaparo, Santa Clara, Hospital, Tupac Amaru', -13.519500, -71.983500),
('Barrio de Lucrepata', 'Zona residencial este', 'Cusco', 'Av. Lucrepata, Calle Recoleta, Pampa de la Alianza', -13.522000, -71.971000)
ON DUPLICATE KEY UPDATE 
	descripcion=VALUES(descripcion), 
	distrito=VALUES(distrito), 
	calles_recorrer=VALUES(calles_recorrer), 
	centro_lat=VALUES(centro_lat), 
	centro_lng=VALUES(centro_lng);
