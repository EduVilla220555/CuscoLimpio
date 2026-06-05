# CuscoLimpio

Proyecto de gestión de alertas, rutas y residuos para el distrito de Cusco.

## Estructura
- `backend/` — API Node.js + Express
- `frontend/` — Cliente React (Vite)
- `database/` — esquema, migraciones y seeds

## Requisitos
- Node.js 18+ y npm
- MySQL (o MariaDB)

## Variables de entorno (resumen)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`
- Frontend: `VITE_API_URL` (ej. `http://localhost:3000/api`)

## Ejecutar localmente

Backend
```bash
cd backend
npm install
cp .env.example .env    # editar con tus credenciales
# ejecutar migraciones y seeds según instrucciones en database/
npm run dev
```

Frontend
```bash
cd frontend
npm install
cp .env.example .env    # establecer VITE_API_URL
npm run dev
```

## Tests
- Backend: en la carpeta `backend` hay pruebas con Jest / supertest.

## Seeds y usuarios de prueba
En `backend/scripts/seed_users.js` se incluyen usuarios de ejemplo: `admin@cuscolimpio.local`, `supervisor@cuscolimpio.local`, `operador@cuscolimpio.local`.

## Contribuir
- Crear ramas por feature: `feature/<descripcion>`
- Abrir PRs hacia `main` y solicitar revisión.

## CI
Se incluye un workflow básico en `.github/workflows/nodejs.yml` que ejecuta tests y build.

## Licencia
MIT
# CuscoLimpio - Sistema de Gestión de Recolección de Residuos Sólidos

## 📋 Descripción
Plataforma web integral para la gestión y monitoreo de la recolección de residuos sólidos en el distrito de Cusco. Permite a operarios, supervisores y administradores coordinar rutas, registrar alertas y generar reportes en tiempo real.

## 🎯 Objetivos
- Optimizar rutas de recolección de residuos
- Monitorear alertas y anomalías en tiempo real
- Generar reportes detallados por zona y tipo de residuo
- Administrar usuarios y asignaciones de rutas
- Mejorar la eficiencia operativa del servicio

## 🛠️ Tech Stack

### Backend
- **Node.js + Express** - Framework web
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación
- **Nodemailer** - Envío de emails

### Frontend
- **React 18** - Framework UI
- **React Router** - Navegación SPA
- **Axios** - Cliente HTTP
- **CSS Vanilla** - Estilos

## 📁 Estructura del Proyecto

```
CuscoLimpio/
├── backend/           # API REST Node.js
├── frontend/          # Aplicación React
├── database/          # Esquemas y migraciones SQL
└── Documentacion/     # Documentos del proyecto
```

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js v16+
- MySQL 8.0+
- npm o yarn

### Backend

1. Instalar dependencias:
```bash
cd backend
npm install
```

2. Crear archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

3. Configurar variables de entorno (ver sección Configuración de MySQL)

4. Iniciar el servidor:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Frontend

1. Instalar dependencias:
```bash
cd frontend
npm install
```

2. Crear archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

3. Iniciar la aplicación:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🗄️ Configuración de MySQL

Ver sección **INSTRUCCIONES PARA BASE DE DATOS** al final de este documento.

## 📚 Rutas Principales de la API

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/refresh` - Renovar token

### Usuarios
- `GET /api/usuarios` - Listar usuarios
- `GET /api/usuarios/:id` - Obtener usuario
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

### Zonas
- `GET /api/zonas` - Listar zonas
- `POST /api/zonas` - Crear zona
- `PUT /api/zonas/:id` - Actualizar zona
- `DELETE /api/zonas/:id` - Eliminar zona

### Residuos
- `GET /api/residuos` - Listar residuos
- `POST /api/residuos` - Registrar residuo
- `GET /api/residuos/tipo/:tipoId` - Residuos por tipo

### Rutas
- `GET /api/rutas` - Listar rutas
- `POST /api/rutas` - Crear ruta
- `PUT /api/rutas/:id` - Actualizar ruta
- `GET /api/rutas/:id/detalles` - Detalles de ruta

### Alertas
- `GET /api/alertas` - Listar alertas
- `POST /api/alertas` - Crear alerta
- `PUT /api/alertas/:id/resolver` - Marcar como resuelta

### Reportes
- `GET /api/reportes/diarios` - Reporte diario
- `GET /api/reportes/zona/:zonaId` - Reporte por zona
- `GET /api/reportes/tipo/:tipoId` - Reporte por tipo

## 🔐 Autenticación

La API utiliza **JWT (JSON Web Tokens)** para autenticación. Cada request autenticado debe incluir:

```
Authorization: Bearer <token>
```

## 👤 Roles y Permisos

- **Admin**: Acceso completo a todas las funciones
- **Supervisor**: Gestión de operarios y rutas
- **Operario**: Ejecución de rutas y reporte de residuos

## 🧪 Testing

Para probar la API, usa Postman o cURL con los ejemplos en la carpeta `Documentacion/`

## 📝 Documentación de Base de Datos

See `database/schema.sql` para el diagrama ER completo.

---

# 🗄️ INSTRUCCIONES PARA BASE DE DATOS (MySQL)

## Paso 1: Crear la Base de Datos

En tu cliente MySQL (MySQL Workbench, phpMyAdmin o línea de comandos), ejecuta:

```sql
CREATE DATABASE cusco_limpio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Paso 2: Seleccionar la Base de Datos

```sql
USE cusco_limpio;
```

## Paso 3: Ejecutar el Schema Principal

Copia el contenido de `database/schema.sql` y ejecútalo. Esto creará la estructura base.

## Paso 4: Ejecutar las Migraciones (en orden)

Ejecuta los archivos en esta secuencia:

```sql
-- 1. Crear tabla usuarios
SOURCE database/migrations/001_crear_usuarios.sql;

-- 2. Crear tabla zonas
SOURCE database/migrations/002_crear_zonas.sql;

-- 3. Crear tabla tipos_residuos y residuos
SOURCE database/migrations/003_crear_residuos.sql;

-- 4. Crear tabla rutas
SOURCE database/migrations/004_crear_rutas.sql;

-- 5. Crear tabla alertas
SOURCE database/migrations/005_crear_alertas.sql;

-- 6. Crear tabla reportes
SOURCE database/migrations/006_crear_reportes.sql;
```

**Nota:** Si usas la línea de comandos, usa:
```bash
mysql -u tu_usuario -p tu_contraseña < database/schema.sql
mysql -u tu_usuario -p tu_contraseña < database/migrations/001_crear_usuarios.sql
# ... y así sucesivamente
```

## Paso 5: Cargar Datos Iniciales (Seeds)

Ejecuta los archivos de seed después de las migraciones:

```sql
SOURCE database/seeds/seed_zonas.sql;
SOURCE database/seeds/seed_tipos_residuos.sql;
```

## Paso 6: Crear Usuario de Aplicación

Por seguridad, crea un usuario MySQL específico para la app:

```sql
CREATE USER 'cusco_app'@'localhost' IDENTIFIED BY 'tu_contraseña_segura';
GRANT ALL PRIVILEGES ON cusco_limpio.* TO 'cusco_app'@'localhost';
FLUSH PRIVILEGES;
```

Si tu archivo `backend/.env` usa `DB_PASSWORD=sistemas123`, crea el usuario con esa misma contraseña:

```sql
CREATE USER 'cusco_app'@'localhost' IDENTIFIED BY 'sistemas123';
GRANT ALL PRIVILEGES ON cusco_limpio.* TO 'cusco_app'@'localhost';
FLUSH PRIVILEGES;
```

## Paso 7: Configurar Variables de Entorno

Actualiza el archivo `backend/.env`:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=cusco_app
DB_PASSWORD=tu_contraseña_segura
DB_NAME=cusco_limpio
```

## Verificación Final

Ejecuta este comando para verificar que todo está bien:

```sql
USE cusco_limpio;
SHOW TABLES;
-- Deberías ver las 7-8 tablas principales
```

---

## 📞 Soporte y Contacto

Para dudas sobre la instalación o funcionalidad, contacta al equipo de desarrollo.

## 📄 Licencia

Proyecto académico - UNSAAC
 
