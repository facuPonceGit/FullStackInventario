# FullStackInventario (Monorepo)

Backend (.NET)
Puerto: 7144 (HTTPS) / 5129 (HTTP)

Base de datos: MySQL con Dapper

Documentación: Swagger automática

Frontend (React)
Puerto: 5173

Variables de entorno: Crear .env.local si es necesario

API Base URL: http://localhost:7144

Base de Datos




# Inventario FullStack (React + .NET 8 + MySQL)

Monorepo del ejemplo de **Inventario** con backend en **ASP.NET Core 8**, acceso a datos con **Dapper** + **MySqlConnector**, frontend en **React 19** con **Vite** y estilos con **Bootstrap**.  
Incluye scripts SQL para crear y poblar la base, y una guía de ejecución local.

---

## 📦 Estructura

FullStackInventario/
├── backend/ # API .NET Core
│ ├── Controllers/ # Endpoints
│ ├── Services/ # Reglas de negocio
│ ├── Data/ # Dapper + MySqlConnector + TypeHandlers DateTime
│ ├── Dtos/ # Data Transfer Objects
│ ├── Models/ # POCOs
│ └── db/
│ ├── 01_schema.sql # crea BD + tablas + índices
│ └── 02_seed_minimo.sql
├── frontend/ # React + Vite
│ ├── src/
│ │ ├── api/ # clientes axios
│ │ ├── components/ # UI (Bootstrap)
│ │ └── utils/ # helpers fechas/formato
│ ├── index.html
│ └── package.json
└── README.md


---

## ✅ Funcionalidad Implementada (R1–R4 + extras)

- **R1**: Alta de equipos y periféricos; listado de periféricos por equipo.
- **R2**: Registro y consulta de **historial de cambios** (fecha, usuario, descripción).
- **R3**: Gestión de **compra / garantía / proveedor** del equipo.
- **R4**: **Ubicación** del equipo (FK a catálogo) y **asignaciones** (vigente + historial).
- **Extras incluidos en el Front**, requisitos faltantes a confirmar:
  - Normalización y formateo robusto de fechas (inputs `date/datetime-local`).
  - Refresco manual de ficha (“↻ Actualizar Vista”) y refrescos automáticos post-alta.
  - Estilos con **Bootstrap**.
  - Logs de requests/responses (axios interceptors) para depuración.

---

## 🔧 Requisitos

- **.NET 8 SDK**
- **Node.js 18+** (o 20+) y **npm**
- **MySQL 8** o **MariaDB 10.4+**
- (Windows) Certificados dev para HTTPS:
  ```bash
  dotnet dev-certs https --trust

🗄️ Base de datos

En backend/db/ encontrarás:

    01_schema.sql → crea BD, tablas, constraints e índices (incluye defaults correctos en fechas).

    02_seed_minimo.sql → datos iniciales (catálogos + 1 equipo de ejemplo).

Aplicación de scripts (como root/administrador):

# Crear estructura
mysql -u root -p < backend/db/01_schema.sql

# Poblar datos
mysql -u root -p inventario < backend/db/02_seed_minimo.sql --Recomendado crear db y poblar manualmente, con los datos en backend/01_schema.sql y 02_seed_minimos.sql_

    El script 01_schema.sql también crea (opcional) el usuario de app:
    inventario_app@localhost con permisos sobre la BD inventario.

🔐 Configuración de conexión (sin secretos en Git)

En backend/appsettings.json se deja un placeholder NO funcional:

{
  "AllowedHosts": "*",
  "Database": { "Provider": "MySql" },
  "ConnectionStrings": {
    "MySqlConnection": "Server=127.0.0.1;Port=3306;Database=inventario;User Id=inventario_app;Password=__SECRET__;CharSet=utf8mb4;SslMode=None;"
  }
}

Guarda tu cadena real con User Secrets (local-only):

cd backend
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:MySqlConnection" "Server=127.0.0.1;Port=3306;Database=inventario;User Id=inventario_app;Password=TU_PASS!;CharSet=utf8mb4;SslMode=None;"

    Cambiá IP/puerto/usuario/clave según tu entorno.
    El proyecto usa Dapper + MySqlConnector y registra TypeHandlers para DateTime/DateTime?.

▶️ Cómo ejecutar - Se deben abrir 2 consolas, una para ejecutar el back y otra para ejecutar el front, ambas en cada carpeta (back y front)
1) Backend (.NET)

cd backend
dotnet build
dotnet run --launch-profile https   # Swagger en https://localhost:7144/swagger

    CORS permite http://localhost:5173 (frontend).

    Perfiles: http (5129) y https (7144).

2) Frontend (React + Vite)

cd frontend
npm i
# (opcional) crear archivo .env.development si querés customizar:
# VITE_API_BASE_URL=https://localhost:7144
# VITE_API_TIMEOUT=10000
npm run dev   # http://localhost:5173

🔗 Endpoints principales (Swagger)

    Salud: GET /ping, GET /db/ping

    Equipos:

        GET /api/Equipos

        POST /api/Equipos

        GET /api/Equipos/{id}/detalle

    Periféricos:

        POST /api/Equipos/{id}/perifericos

        GET /api/Equipos/{id}/perifericos

    Historial:

        POST /api/Equipos/{id}/historial

        GET /api/Equipos/{id}/historial

    Compra/Garantía/Proveedor:
    PUT /api/Equipos/{id}/compra-garantia

    Ubicación (0 o ausencia = limpiar):
    PUT /api/Equipos/{id}/ubicacion/{ubicacionId?}

    Asignaciones:

        POST /api/Equipos/{id}/asignar

        GET /api/Equipos/{id}/asignacion (vigente o null)

        GET /api/Equipos/{id}/asignaciones (historial)

    Catálogos:
    GET /api/Proveedores, GET /api/Ubicaciones, GET /api/UsuariosAsignados

🧰 Problemas comunes (Windows)

    Unlink de esbuild.exe al cambiar de rama: cerrá npm run dev, y si persiste:

    taskkill /IM node.exe /F
    taskkill /IM esbuild.exe /F

    Luego npm ci en frontend/ si borraste binarios.

    Certificados HTTPS: dotnet dev-certs https --trust.

    CORS: el backend ya habilita http://localhost:5173.

🧪 Datos de prueba

Tras ejecutar 02_seed_minimo.sql tendrás:

    Proveedores, ubicaciones y usuarios precargados.

    Un equipo ejemplo con 1 periférico, 1 cambio y 1 asignación vigente.

🧭 Flujo Git recomendado

    Rama de trabajo: dev

    Rama estable/productiva: main (protegida)

    Publicación estable: merge dev → main con --no-ff

    Crear tag en hitos: git tag -a v0.X.Y -m "..." && git push origin v0.X.Y