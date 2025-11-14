Sistema de Gestión de Inventario Informático
Sistema completo de gestión de inventario desarrollado como Trabajo Final Integrador para la materia Administración de Recursos de la UTN FRT. Incluye backend en .NET 8, frontend en React y base de datos MySQL.

 Características
Funcionalidades Principales
Gestión completa de equipos informáticos (alta, modificación, consulta)

Control de periféricos y componentes asociados a cada equipo

Seguimiento de asignaciones a usuarios con historial completo

Gestión de garantías y proveedores

Registro de cambios con historial detallado

Sistema de ubicaciones para organización física

Reportes ejecutivos con gráficos y exportación a PDF/Excel

Tecnologías Utilizadas
Backend
.NET 8 con ASP.NET Core

Dapper para acceso a datos

MySQL/MariaDB como base de datos

Swagger para documentación de API

QuestPDF y ClosedXML para generación de reportes

Frontend
React 19 con Vite

Bootstrap 5 + React Bootstrap

Chart.js para gráficos interactivos

Axios para consumo de APIs

Font Awesome para iconografía

Base de Datos
MySQL 8.0+ / MariaDB 10.4+

Esquema normalizado con relaciones y constraints

Índices optimizados para consultas frecuentes

📋 Requisitos del Sistema
Prerrequisitos
.NET 8 SDK

Node.js 18+

MySQL 8.0+ o MariaDB 10.4+

Git

Puertos Utilizados
Backend: 7144 (HTTPS) / 5129 (HTTP)

Frontend: 5173

Base de datos: 3306 (por defecto)

🛠️ Instalación y Configuración
1. Clonar el Repositorio
bash
git clone <url-del-repositorio>
cd FullStackInventario
2. Configuración de la Base de Datos
Crear la base de datos:
bash
mysql -u root -p < backend/db/01_schema.sql
Poblar con datos iniciales:
bash
mysql -u root -p inventario < backend/db/02_seed_minimo.sql
Configurar conexión (User Secrets):
bash
cd backend
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:MySqlConnection" "Server=127.0.0.1;Port=3306;Database=inventario;User Id=inventario_app;Password=TU_PASSWORD;CharSet=utf8mb4;SslMode=None;"
3. Ejecutar el Backend
bash
cd backend
dotnet build
dotnet run --launch-profile https
La API estará disponible en: https://localhost:7144/swagger

4. Ejecutar el Frontend
bash
cd frontend
npm install
npm run dev
La aplicación estará disponible en: http://localhost:5173

🎯 Funcionalidades Implementadas
Gestión de Equipos
Creación y listado de equipos informáticos

Códigos de inventario únicos

Campos para marca, modelo, tipo y número de serie

Estados activo/inactivo

Periféricos y Componentes
Asociación de periféricos a equipos

Tipos, marcas, modelos y números de serie

Gestión completa de componentes

Historial de Cambios
Registro detallado de modificaciones

Fechas y usuarios responsables

Descripciones completas de cambios

Gestión de Garantías y Proveedores
Fechas de adquisición y vencimiento de garantía

Asociación con proveedores

Alertas de garantías próximas a vencer

Sistema de Asignaciones
Asignación de equipos a usuarios

Historial completo de asignaciones

Fechas de inicio y fin

Observaciones y seguimiento

Sistema de Ubicaciones
Gestión de ubicaciones físicas

Asignación y cambio de ubicaciones

Organización por áreas

Reportes y Análisis
Dashboard con métricas principales

Gráficos de distribución por tipo y área

Estado de garantías

Exportación a PDF y Excel

🔌 Endpoints Principales de la API
Equipos
GET /api/Equipos - Listar todos los equipos

POST /api/Equipos - Crear nuevo equipo

GET /api/Equipos/{id}/detalle - Detalle completo del equipo

Periféricos
POST /api/Equipos/{id}/perifericos - Agregar periférico

GET /api/Equipos/{id}/perifericos - Listar periféricos

Historial
POST /api/Equipos/{id}/historial - Registrar cambio

GET /api/Equipos/{id}/historial - Consultar historial

Asignaciones
POST /api/Equipos/{id}/asignar - Asignar usuario

GET /api/Equipos/{id}/asignacion - Asignación vigente

GET /api/Equipos/{id}/asignaciones - Historial de asignaciones

Reportes
GET /api/Reportes/resumen - Resumen ejecutivo

GET /api/Reportes/garantias - Estado de garantías

GET /api/Reportes/excel - Descargar Excel

GET /api/Reportes/pdf - Descargar PDF

Catálogos
GET /api/Proveedores - Listar proveedores

GET /api/Ubicaciones - Listar ubicaciones

GET /api/UsuariosAsignados - Listar usuarios

🏫 Universidad
Universidad Tecnológica Nacional - Facultad Regional Tucumán
Materia: Administración de Recursos - 2025
Docentes:

Cordero, Lucas Elio

Ugarte, Fernando Gabriel

Quiroga Hamoud, Maria Celeste

📄 Licencia
Este proyecto fue desarrollado con fines educativos para la Universidad Tecnológica Nacional - Facultad Regional Tucumán.

🆘 Soporte y Contacto
Para consultas técnicas o problemas de implementación, contactar a los desarrolladores del proyecto.