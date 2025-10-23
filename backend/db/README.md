// backend/db/Readme.md
# Backend Inventario (R1–R4)

API en **ASP.NET Core (.NET 8)** con **Dapper** y **MySQL/MariaDB**.
Incluye endpoints para: equipos, periféricos, historial de cambios,
compra/garantía/proveedor, ubicación, asignaciones y ficha integral.

## Requisitos
- .NET 8 SDK
- MySQL/MariaDB (10.4+)
- Visual Studio 2022 / VS Code
- Opcional: Git, GitHub CLI (`gh`)

## Configuración de conexión (sin secretos en Git)
1. En `appsettings.json` deja un placeholder (NO la contraseña real):
   ```json
   {
     "AllowedHosts": "*",
     "Database": { "Provider": "MySql" },
     "ConnectionStrings": {
       "MySqlConnection": "Server=127.0.0.1;Port=3308;Database=inventario;User Id=inventario_app;Password=__SECRET__;CharSet=utf8mb4;SslMode=None;"
     }
   }
   ```
2. Guarda la cadena real con **User Secrets** (solo local):
   ```bash
   dotnet user-secrets init
   dotnet user-secrets set "ConnectionStrings:MySqlConnection" "Server=127.0.0.1;Port=3308;Database=inventario;User Id=inventario_app;Password=TU_PASS;CharSet=utf8mb4;SslMode=None;"
   ```

## Base de datos
Scripts en `db/`:
- `01_schema.sql`  → crea schema/tablas/índices.
- `02_seed_minimo.sql` → datos iniciales (catálogos + ejemplo).

Ejecutar (root/admin):
```bash
mysql -u root -p < db/01_schema.sql
mysql -u root -p inventario < db/02_seed_minimo.sql
```

## Ejecutar el backend
```bash
dotnet build
dotnet run
```
Swagger: https://localhost:7144/swagger

## Endpoints principales
- Salud: `GET /ping`, `GET /db/ping`
- Equipos: `GET/POST /api/equipos`
- Periféricos: `POST/GET /api/equipos/{id}/perifericos`
- Historial: `POST/GET /api/equipos/{id}/historial`
- Compra/Garantía: `PUT /api/equipos/{id}/compra-garantia`
- Ubicación: `PUT /api/equipos/{id}/ubicacion/{ubicacionId?}`
- Asignación: `POST /api/equipos/{id}/asignar`
- Ficha: `GET /api/equipos/{id}/detalle`

## Git: inicialización rápida
```bash
git init
git add .
git commit -m "feat(backend): API Inventario R1–R4 base"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/FullStackInventario.git
git push -u origin main
```

## Licencia
MIT (o la que prefieras).
