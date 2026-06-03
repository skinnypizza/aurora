# Scrumban App - Rediseño Especificación para Stitch

## Tipo de Proyecto
- **Web App**: Project Management (Scrumban/Agile)
- **Plataforma**: SaaS de gestión de proyectos

## Funcionalidades Principales

### 1. Autenticación
- Login con email/password
- Registro de usuarios
- Modo local (sin cuenta)

### 2. Dashboard Global
- Vista de todos los proyectos
- Stats: progreso total, historias completadas, miembros

### 3. Tablero Kanban
- 5 columnas: Backlog, To Do, In Progress, Review, Done
- Drag & drop de historias
- WIP limits configurables
- Filtro por miembro
- Modo compacto

### 4. Backlog
- Lista de historias priorizada
- Prioridades: Must, Should, Could, Wont
- Story points (SP)
- Asignación a miembros

### 5. Sprint
- Planificación de sprint
- Velocity target
- Burndown chart
- Retrospectiva

### 6. Equipo
- Miembros del proyecto (cloud)
- Miembros locales (AI agents)
- Carga de trabajo por sprint

### 7. Métricas
- Velocity chart
- Distribución MoSCoW
- % completado

### 8. Configuración
- Nombre, descripción, tech stack
- Sprints totales
- WIP limits

## Requisitos de Diseño

### Colores (Dark Theme - Primary)
- Background: `#0b1326` (deep navy)
- Surface: `#171f33`
- Surface elevated: `#222a3d`
- Primary accent: `#6366f1` (indigo)
- Text primary: `#dae2fd`
- Text secondary: `#c7c4d7`
- Text muted: `#908fa0`

### Colores de Columnas
- Backlog: `#6b7280` (gray)
- Todo: `#3b82f6` (blue)
- InProgress: `#8b5cf6` (purple)
- Review: `#f59e0b` (amber)
- Done: `#10b981` (emerald)

### Tipografía
- Headers: Outfit (bold)
- Body: Inter
- Code: JetBrains Mono

### UI Elements
- Cards con border sutil y shadow
- Bordes redondeados (8-16px)
- Spacing consistente
- Skeleton loaders
- Toasts para feedback

### Responsive
- Desktop: Sidebar expandida
- Tablet: Sidebar colapsada
- Mobile: Navbar inferior

## Prompt para Stitch

```
Create a modern project management dashboard for an Agile/Scrumban application.
The app has:
- A sidebar with project list and user profile
- Main content area with tabs: Board, Backlog, Sprint, Team, Metrics, Settings
- A Kanban board with 5 columns: Backlog, To Do, In Progress, Review, Done
- Dark theme with deep navy background (#0b1326) and indigo accents (#6366f1)
- Clean, minimalist cards with story titles, IDs, priority badges, and assignee avatars
- Progress bars and velocity charts
- Mobile responsive design

Include:
- Floating action buttons
- Search input with icon
- Tab navigation bar
- Modal dialogs for forms
- Toast notifications
- Skeleton loading states

Use:
- Outfit font for headings
- Inter font for body text
- Rounded corners (12-16px)
- Subtle shadows and borders
- Smooth transitions
```

## Archivos a Modificar
1. `public/index.html` - Estructura y componentes
2. `public/css/style.css` - Estilos (mantener lógica, actualizar diseño)
3. `public/js/app.js` - NO modificar (funcionalidad intacta)

## Restricciones
- **NO** cambiar ninguna funcionalidad
- **NO** modificar la lógica de negocio
- **SOLO** actualizar diseño/UI
- Mantener todos los IDs de elementos y funciones JS