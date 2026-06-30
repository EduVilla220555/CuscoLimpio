# CuscoLimpio: Historias de Usuario y Funcionalidades

Este documento detalla las funcionalidades principales del sistema y las historias de usuario asociadas, tomando en cuenta el enfoque exclusivo en el monitoreo de rutas y alertas para el **Distrito de Cusco**.

## Funcionalidades del Sistema

1. **Gestión de Identidad y Accesos (IAM)**
   - Autenticación segura mediante correo y contraseña.
   - Control de acceso basado en roles (Administrador, Supervisor, Operador).
2. **Dashboard Interactivo (Panel Principal)**
   - Visualización de métricas operativas (rutas monitoreadas, alertas activas).
   - Mapa en tiempo real integrado para visualizar el área de acción.
3. **Gestión de Usuarios**
   - Creación, edición, eliminación y listado de personal operativo.
4. **Monitoreo y Asignación de Rutas (Cusco)**
   - Registro de rutas específicas del distrito de Cusco (ej. Centro Histórico, San Blas).
   - Asignación de rutas a operadores específicos.
   - Trazabilidad del estado de la ruta (Pendiente, En progreso, Completada).
   - Visualización cartográfica (mapa interactivo) con la línea de tiempo del recorrido.
5. **Sistema de Alertas e Incidencias**
   - Registro de alertas asociadas a rutas o usuarios.
   - Cambio de estado de las alertas (Abierta, Resuelta).

---

## Historias de Usuario

A continuación se presentan las historias de usuario divididas por el rol que interactúa con el sistema.

### Rol: Administrador
**1. Gestión de personal clave**
> **Como** administrador, 
> **quiero** poder registrar, editar y eliminar cuentas de supervisores y operadores,
> **para** tener el control completo sobre quiénes pueden acceder al sistema de CuscoLimpio.

**2. Control de accesos y roles**
> **Como** administrador, 
> **quiero** poder modificar el rol de un usuario existente,
> **para** otorgarle mayores permisos si es ascendido a supervisor o remover accesos si es necesario.

**3. Visión global operativa**
> **Como** administrador, 
> **quiero** visualizar un dashboard con métricas clave y un mapa del distrito de Cusco,
> **para** entender rápidamente el avance diario y la cantidad de incidencias pendientes.

### Rol: Supervisor
**4. Planificación de rutas**
> **Como** supervisor, 
> **quiero** poder crear nuevas rutas de recolección nombrando sectores específicos del distrito de Cusco,
> **para** estructurar las zonas de trabajo diario del equipo.

**5. Asignación de responsabilidades**
> **Como** supervisor, 
> **quiero** poder vincular un operador específico a cada ruta creada,
> **para** llevar un seguimiento claro de quién es el responsable de cada recorrido.

**6. Seguimiento de incidencias (Creación)**
> **Como** supervisor, 
> **quiero** registrar alertas sobre problemas viales o fallas logísticas vinculadas a una ruta,
> **para** que quede un registro formal de los obstáculos durante la jornada.

**7. Resolución de problemas**
> **Como** supervisor, 
> **quiero** poder marcar una alerta como "resuelta" cuando se solucione el inconveniente,
> **para** limpiar la bandeja de notificaciones operativas.

**8. Actualización de rutas en progreso**
> **Como** supervisor, 
> **quiero** tener la capacidad de reasignar o modificar las fechas de una ruta activa,
> **para** poder reaccionar ante ausencias del personal u otros imprevistos.

### Rol: Operador (Personal de Campo)
**9. Acceso simplificado**
> **Como** operador, 
> **quiero** que al iniciar sesión solo se me muestren mis rutas y opciones pertinentes,
> **para** no distraerme con configuraciones administrativas complejas.

**10. Visualización geoespacial del trabajo**
> **Como** operador, 
> **quiero** poder ver mis rutas asignadas dibujadas sobre un mapa del distrito de Cusco,
> **para** ubicar geográficamente por dónde debo empezar y terminar mi recorrido.

**11. Marcaje de finalización**
> **Como** operador, 
> **quiero** poder cambiar el estado de mi ruta a "Completada" mediante un botón rápido,
> **para** notificar inmediatamente a los supervisores que he terminado mi trabajo.

**12. Seguimiento de línea de tiempo**
> **Como** operador, 
> **quiero** visualizar una línea de tiempo (timeline) con los puntos de control de mi ruta,
> **para** confirmar mi avance a lo largo del día.
