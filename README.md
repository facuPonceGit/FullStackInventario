# FullStackInventario (Monorepo)

# Inventario FullStack (React + .NET API + MySQL)

Monorepo con:
- **backend/** → ASP.NET Core 8 + Dapper + MySqlConnector
- **frontend/** → React 19 + Vite
- **db/** → scripts `01_schema.sql` y `02_seed_minimo.sql` para crear y poblar la BD

## Requisitos
- **.NET 8 SDK**
- **Node 18+** (o 20+) y **npm**
- **MySQL 8 / MariaDB 10.4+**
- (Windows) Dev certs para HTTPS:
  ```bash
  dotnet dev-certs https --trust



## Base de datos
En `backend/db/`:
1) `01_schema.sql`  (crea schema/tablas)  
2) `02_seed_minimo.sql` (datos iniciales)  

```bash
mysql -u root -p < backend/db/01_schema.sql
mysql -u root -p inventario < backend/db/02_seed_minimo.sql

FullStackInventario/
├── backend/                 # API .NET Core
│   ├── Controllers/        # Controladores de la API
│   ├── Services/           # Lógica de negocio
│   ├── Data/              # Acceso a datos (Dapper)
│   ├── Models/            # Modelos de datos
│   ├── Dtos/              # Data Transfer Objects
│   └── db/                # Scripts de base de datos
├── frontend/              # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── api/          # Clientes API
│   │   └── utils/        # Utilidades
│   └── package.json
└── README.md
01_schema.sql - Estructura completa de la base de datos

02_seed_minimo.sql - Datos iniciales (catálogos + ejemplo)
Backend (.NET)
Puerto: 7144 (HTTPS) / 5129 (HTTP)

Base de datos: MySQL con Dapper

Documentación: Swagger automática

Frontend (React)
Puerto: 5173

Variables de entorno: Crear .env.local si es necesario

API Base URL: http://localhost:7144

Base de Datos