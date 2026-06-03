# ⬡ Scrumban App — AI Project Guide

> **Versión:** 2.1 (AURORA)  
> **Propósito:** Sistema de gestión de proyectos ágil (Scrumban) con soporte multi-proyecto, equipo, sprints, métricas y exportación.  
> **Stack:** Node.js + Express (server) · HTML+CSS+JS vanilla (frontend) · MongoDB Atlas o JSON en disco  
> **Filosofía:** Sin dependencias pesadas, IA-Friendly, Portable, Premium UX.

---

## Índice para IAs

1. [¿Qué es?](#qué-es)
2. [Arquitectura](#arquitectura)
3. [Quick Start](#quick-start)
4. [CLI Tool (FR-31)](#cli-tool-fr-31)
5. [Estructura de Archivos](#estructura-de-archivos)
6. [Modelo de Datos](#modelo-de-datos)
7. [API REST](#api-rest)
8. [Sugerencias IA (FR-32)](#sugerencias-ia-fr-32)
9. [Requerimientos Cubiertos](#requerimientos-cubiertos)

---

## ¿Qué es?

**Scrumban App** es un tablero Kanban con planificación tipo Scrum para gestionar proyectos de software.  
Permite organizar historias de usuario en columnas (Backlog → Todo → In Progress → Review → Done), asignarlas a miembros del equipo, planificar sprints, medir velocidad y generar reportes.

**Características Aurora v2.1:**
- **Persistencia Híbrida**: Soporta MongoDB Atlas o Archivos JSON.
- **Diseño Cyberpunk**: Interfaz premium con glassmorphism y animaciones.
- **IA-Native**: Diseñado para ser leído y escrito por IAs (IDs predecibles, schemas documentados).
- **Templates (FR-36)**: Proyectos pre-configurados (Scrum, Kanban, Fast Track).

---

## Arquitectura

La aplicación utiliza el patrón **Repository** para desacoplar la persistencia de la lógica de negocio.

```
┌──────────────────────┐     ┌──────────────────────┐
│   Servidor Express   │◄───►│   Cliente SPA        │
│   (server.js)        │     │   (app.js / CSS)     │
└──────────┬───────────┘     └──────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│         Repository Interface           │
├───────────────────┬────────────────────┤
│  FileRepository   │  MongoRepository   │
│  (JSON en disco)  │  (MongoDB Atlas)   │
└───────────────────┴────────────────────┘
```

---

## Quick Start

### Server mode

```bash
# Configurar .env con MONGO_URI si deseas usar MongoDB
node server.js
# → http://localhost:3737
```

### CLI Tool (FR-31)

Herramienta de terminal para interactuar con los datos sin abrir el navegador.

```bash
node cli.js list          # Listar proyectos
node cli.js stats         # Ver estadísticas generales
node cli.js show <id>     # Ver historias de un proyecto
node cli.js export <id>   # Generar reporte Markdown
```

---

## Estructura de Archivos

```
D:\ProyectoMovilidad\scrumban-app\
├── server.js                 ← Express API
├── mongo-repo.js             ← Implementación MongoDB Atlas
├── file-repo.js              ← Implementación JSON
├── cli.js                    ← Herramienta de línea de comandos
├── README_AI.md              ← Esta guía (Contexto Maestro)
├── public/
│   ├── index.html            ← Estructura base
│   ├── js/app.js             ← Lógica frontend (v2.1)
│   └── css/style.css         ← Diseño Cyberpunk Aurora
└── proyectos/                ← Persistencia JSON (opcional)
```

---

## Sugerencias IA (FR-32)

La aplicación incluye un módulo de **Sugerencias Inteligentes** dentro del detalle de cada historia.  
- Genera automáticamente Criterios de Aceptación (AC) basados en el título.
- Recomienda estimación de Story Points (SP).
- Ayuda a desglosar subtareas técnicas.

---

## API REST (Resumen)

| Método | Endpoint | Acción |
|--------|----------|--------|
| `GET` | `/api/projects` | Listar proyectos con progreso |
| `POST` | `/api/projects` | Crear (soporta `template`, `wipLimits`) |
| `GET` | `/api/projects/:id/context` | **Crucial para IA**: Todo el proyecto en un JSON |
| `PATCH` | `/api/projects/:id/stories/:sid/move` | Mover entre columnas (Kanban) |
| `POST` | `/api/projects/:id/sprints/:num/close` | Cerrar sprint (calcula velocidad y limpia backlog) |

---

## Requerimientos Cubiertos

**Funcionales: 36/36 (100% [OK])**
- CRUD Completo Proyectos/Historias/Equipo/Sprints.
- Tablero con Drag & Drop, WIP Limits y Filtros.
- Métricas MoSCoW, Velocity y Burndown.
- CLI, Templates e Integración IA nativa.

**No Funcionales: 15/15 (100% [OK])**
- MongoDB Ready, Performance optimizada, IDs predecibles.
- Atajos de teclado: `n` (nuevo), `p` (proyecto), `1-7` (tabs), `Esc` (cerrar).
- UI en español con tema oscuro/claro persistente.

---

*Esta documentación es el "Source of Truth" para cualquier asistente de IA que trabaje en este repositorio.*
