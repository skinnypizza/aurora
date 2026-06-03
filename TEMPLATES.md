# Scrumban App — Schemas de Archivos

> Este documento describe la estructura de todos los archivos JSON utilizados por la aplicación.
> Las IAs pueden leer este archivo para entender inmediatamente cómo interactuar con los datos.
>
> [!] **Todos los archivos incluyen un campo `_comment`** con instrucciones para IAs.

---

## Estructura General

```
proyectos/
├── index.json              ← Catálogo de todos los proyectos
├── {project-id}/
│   ├── project.json         ← Metadata del proyecto
│   ├── team.json            ← Miembros del equipo
│   ├── README.md            ← Descripción (humano + IA)
│   ├── backlog/
│   │   ├── {ID}.json        ← Una historia por archivo (usar guiones, ej: SGE-1-1.json)
│   │   └── ...
│   ├── sprints/
│   │   ├── sprint-01.json   ← Planificación del sprint
│   │   └── ...
│   └── docs/
│       ├── context.md       ← Contexto generado automáticamente para IAs
│       └── ...              ← Documentación opcional (MD)
```

> **IMPORTANTE para IAs que escriben archivos:**
> - El `id` dentro del JSON usa puntos: `"id": "SGE-1.1"`
> - El **filename** en disco usa guiones: `SGE-1-1.json`
> - El servidor mapea automáticamente puntos ↔ guiones

---

## `proyectos/index.json`

```json
{
  "_comment": "Catálogo de todos los proyectos. Editado automáticamente.",
  "projects": [
    {
      "id": "sge",
      "title": "SGE — Sistema de Geolocalización de Empleados",
      "created": "2026-05-14T16:07:00.000Z"
    }
  ]
}
```

---

## `proyectos/{id}/project.json`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_comment` | string | Propósito del archivo para IAs |
| `id` | string | ID único del proyecto (slug, sin espacios) |
| `title` | string | Nombre visible del proyecto |
| `description` | string | Descripción larga |
| `techStack` | string[] | Tecnologías usadas |
| `status` | "active" \| "archived" | Estado del proyecto |
| `created` | string | ISO timestamp |
| `updated` | string | ISO timestamp |
| `currentSprint` | number | Número del sprint activo |
| `totalSprints` | number | Total de sprints planeados |
| `sprintDurationWeeks` | number | Duración de cada sprint |
| `defaultColumns` | string[] | Columnas del board: `Backlog`, `Todo`, `InProgress`, `Review`, `Done` |
| `wipLimits` | object | Límites WIP: `{"InProgress": 4, "Review": 3}` |

```json
{
  "_comment": "Estructura del proyecto. Editable por humanos e IAs.",
  "id": "sge",
  "title": "SGE — Sistema de Geolocalización de Empleados",
  "description": "Sistema de monitoreo en tiempo real...",
  "techStack": [".NET 9", "PostgreSQL", "Flutter"],
  "status": "active",
  "created": "2026-05-01T00:00:00.000Z",
  "updated": "2026-05-14T00:00:00.000Z",
  "currentSprint": 3,
  "totalSprints": 4,
  "sprintDurationWeeks": 2,
  "defaultColumns": ["Backlog", "Todo", "InProgress", "Review", "Done"],
  "wipLimits": { "InProgress": 4, "Review": 3 }
}
```

---

## `proyectos/{id}/backlog/{ID}.json`

Cada historia de usuario es un archivo individual. **Filename usa guiones** (ej: `SGE-1-1.json`) pero el `id` dentro usa puntos (`"id": "SGE-1.1"`).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_comment` | string | Propósito del archivo para IAs |
| `id` | string | Formato: `{PROYECTO}-{SPRINT}.{NUMERO}`. Ej: `SGE-3.7` |
| `title` | string | Título corto de la historia |
| `priority` | "Must" \| "Should" \| "Could" \| "Wont" | Prioridad (MoSCoW) |
| `sp` | number | Story Points (1-21, típicamente 1,2,3,5,8,13,21) |
| `status` | "Backlog" \| "Todo" \| "InProgress" \| "Review" \| "Done" | Columna actual |
| `assignee` | string | Alias del miembro (ej: "ETH") |
| `sprint` | number \| null | Sprint asignado; `null` = backlog general |
| `story` | string | Descripción tipo "Como... quiero... para..." |
| `subtasks` | string[] | Lista de sub-tareas |
| `ac` | string[] | Criterios de aceptación |
| `deps` | string[] | IDs de historias de las que depende (ej: `["SGE-1.3"]`) |
| `created` | string | ISO timestamp de creación |
| `updated` | string | ISO timestamp de última modificación |

```json
{
  "_comment": "Cada archivo = una historia. IDs: PROYECTO-SPRINT.NUMERO (ej: SGE-3.7). Filename usa guiones (SGE-3-7.json).",
  "id": "SGE-2.1",
  "title": "Integración Vue con API de Autenticación (JWT Interceptor)",
  "priority": "Must",
  "sp": 5,
  "status": "InProgress",
  "assignee": "ETH",
  "sprint": 2,
  "story": "Como usuario del sistema, quiero poder iniciar sesión desde el frontend Vue...",
  "subtasks": [
    "Configurar Axios con interceptors para adjuntar JWT Bearer token",
    "Implementar Pinia store de autenticación"
  ],
  "ac": [
    "Login funciona con credenciales reales de la BD",
    "Token se almacena y reenvía en cada petición"
  ],
  "deps": ["SGE-1.3"],
  "created": "2026-05-08T00:00:00.000Z",
  "updated": "2026-05-10T14:30:00.000Z"
}
```

---

## `proyectos/{id}/sprints/sprint-{NN}.json`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_comment` | string | Propósito del archivo para IAs |
| `id` | number | Número de sprint |
| `name` | string | Nombre del sprint |
| `objective` | string | Objetivo del sprint |
| `durationWeeks` | number | Duración en semanas |
| `capacityHours` | number | Horas disponibles |
| `velocity` | number | Story Points objetivo (o real, al cerrar) |
| `startDate` | string | Fecha inicio (ISO) |
| `endDate` | string | Fecha fin (ISO) |
| `stories` | string[] | IDs de historias en el sprint |
| `retrospective` | string | Notas de retrospectiva |

```json
{
  "_comment": "Planificación del sprint. stories[] = array de IDs de historias.",
  "id": 3,
  "name": "Sprint 3",
  "objective": "Completar módulo mobile y web",
  "velocity": 48,
  "stories": ["SGE-3.1", "SGE-3.2", "SGE-3.3"],
  "retrospective": "Buen sprint. Mejorar estimaciones."
}
```

---

## `proyectos/{id}/team.json`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_comment` | string | Propósito del archivo para IAs |
| `members` | object[] | Lista de miembros |
| `members[].alias` | string | Iniciales/Código (ej: "ETH") — **único por proyecto** |
| `members[].name` | string | Nombre completo |
| `members[].role` | string | Rol en el proyecto |
| `members[].spPerSprint` | number | Capacidad en SP por sprint |
| `members[].color` | string | Color hex para UI (ej: "#6366f1") |
| `members[].email` | string | Email (opcional) |

```json
{
  "_comment": "Equipo del proyecto. Cada miembro tiene alias único.",
  "members": [
    {
      "alias": "ETH",
      "name": "Eithan Cardenas Luna",
      "role": "Frontend Developer (Vue)",
      "spPerSprint": 15,
      "color": "#6366f1",
      "email": "ethan@example.com"
    }
  ]
}
```

---

## `proyectos/{id}/docs/context.md`

Generado automáticamente por el servidor via `GET /api/projects/:id/context`.
Contiene un resumen legible del estado actual del proyecto para que la IA lo use como contexto inicial.

Incluye:
- Metadata del proyecto
- Resumen numérico (stories, SP, progreso)
- Equipo y cargas
- Estado de cada sprint
- Historias en progreso

---

## Cómo las IAs pueden usar esta estructura

### Leer contexto de un proyecto:
```bash
# API endpoint (recomendado)
curl http://localhost:3737/api/projects/sge/context

# O directamente desde archivos
cat proyectos/sge/project.json
cat proyectos/sge/backlog/*.json
cat proyectos/sge/sprints/*.json
cat proyectos/sge/team.json
```

### Crear una historia:
```bash
cat > proyectos/sge/backlog/SGE-4-1.json << 'EOF'
{
  "_comment": "Cada archivo = una historia.",
  "id": "SGE-4.1",
  "title": "Pruebas de integración",
  "priority": "Must",
  "sp": 5,
  "status": "Todo",
  "assignee": "GER",
  "sprint": 4,
  ...
}
EOF
```

### Planificar un sprint:
1. Leer `backlog/*.json` para ver historias sin sprint
2. Leer `team.json` para conocer capacidad del equipo
3. Seleccionar historias priorizando Must > Should > Could
4. Crear `sprints/sprint-04.json` con las historias seleccionadas
5. Actualizar el campo `sprint` en cada historia JSON
6. Actualizar `project.json` → `currentSprint` y `totalSprints`
