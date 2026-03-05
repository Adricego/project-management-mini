# Project Management Mini (Fullstack TypeScript)

Demo fullstack para gestionar **proyectos** y **trabajadores**:

- Crear trabajadores
- Crear proyectos
- Asignar trabajadores a proyectos
- Listar proyectos con sus trabajadores asignados

Este proyecto fue desarrollado como prueba técnica junior fullstack, priorizando estructura clara, decisiones justificadas y un flujo end-to-end completo.

## Video explicativo (máx. 5 min)

- Enlace: [Ver video explicativo](https://youtu.be/vu1kdRMyybo)

## Stack Tecnológico

### Backend
- Node.js + Express
- TypeScript
- Persistencia en memoria (Map)

### Frontend
- React + TypeScript + Vite
- Tailwind CSS


## Requisitos cubiertos

- ✅ Crear un proyecto (nombre, cliente, fechas inicio/término, trabajadores asignados)
- ✅ Crear trabajadores (nombre, rol, seniority)
- ✅ Asignar trabajadores a un proyecto
- ✅ Listar proyectos con sus trabajadores asociados

## Cómo ejecutar

### Backend
```bash
cd backend
npm install
npm run dev
```
Backend corre en:
- `http://localhost:3001`

## Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend corre en:
- `http://localhost:5173`

## Endpoints del API

### Workers (Trabajadores)

#### Listar trabajadores
- **GET** `/workers`

#### Crear trabajador
- **POST** `/workers`

Body de ejemplo:
```json
{
  "name": "Ana Pérez",
  "role": "frontend",
  "seniority": "junior"
}
```

#### Asignar trabajador a proyecto
- **POST** `/projects/:projectId/assign/:workerId`

Ejemplo:
```bash
POST /projects/p_1/assign/w_1
```

#### Utilidades de demo

Reset de datos en memoria
- **POST** `/admin/reset`

Respuesta:
```json
{ "ok": true}
```
## Estructura del proyecto

```txt
project-management-mini/
  backend/
    src/
      models/
      repositories/      # almacenamiento in-memory (Map)
      services/          # reglas de negocio + validación
      routes/            # rutas HTTP
      app.ts
  frontend/
    src/
      api/               # clientes fetch tipados
      components/
      App.tsx
  README.md
```

## Decisiones de diseño

### Persistencia en memoria
Se usa persistencia en memoria para mantener la solución simple y enfocada en los requerimientos solicitados.

**Trade-off:** los datos se pierden al reiniciar el backend.

### Separación de responsabilidades
- **Routes:** manejan HTTP y status codes.
- **Services:** aplican reglas de negocio y validaciones.
- **Repositories:** encapsulan el acceso a datos (in-memory).

Esto permite cambiar a una base de datos real sin reescribir toda la lógica.

## Cómo escalaría la solución

### Si existieran 10.000+ proyectos
- Usar una DB real (PostgreSQL) con índices.
- Implementar paginación en listados.
- Agregar filtros (cliente, rango de fechas, trabajador).
- Usar caché para consultas frecuentes (por ejemplo Redis).

### Si múltiples usuarios lo usaran al mismo tiempo
- Agregar autenticación (sessions o JWT).
- Transacciones y restricciones a nivel DB para evitar inconsistencias.
- Auditoría (quién asignó a quién y cuándo).
- Rate limiting + validación fuerte en el borde del API.

### Si se agregaran permisos por rol
- RBAC (roles tipo `admin`, `manager`, `viewer`).
- Middleware de autorización por ruta.
- La UI puede ocultar acciones, pero el backend debe imponer permisos siempre.