# Guía de Contribución — Scrumban App

> **Idioma:** Español  
> **Versión:** 1.0

Gracias por tu interés en contribuir a Scrumban App. Esta guía te ayudará a comenzar.

---

## Tabla de Contenidos

1. [Cómo Reportar Issues](#cómo-reportar-issues)
2. [Cómo Enviar Pull Requests](#cómo-enviar-pull-requests)
3. [Estilo de Código](#estilo-de-código)
4. [Configuración del Entorno de Desarrollo](#configuración-del-entorno-de-desarrollo)
5. [Estructura del Proyecto](#estructura-del-proyecto)

---

## Cómo Reportar Issues

### Bugs

1. **Verifica si ya existe** — Busca en [issues](https://github.com/tu-usuario/scrumban-app/issues) antes de crear uno nuevo
2. **Usa la plantilla** — Si existe plantilla de bug, úsala. Si no, incluye:
   - **Título descriptivo:** Ej: "Error al crear historia con caracteres especiales"
   - **Pasos para reproducir:** Describe cada paso desde un estado inicial conocido
   - **Comportamiento esperado:** Qué debería ocurrir
   - **Comportamiento actual:** Qué ocurre realmente
   - **Capturas de pantalla:** Si aplica, adjunta imágenes
   - **Entorno:**
     - Navegador y versión
     - Modo (local/cloud)
     - Node.js version
     - Sistema operativo

### Solicitudes de Funcionalidad

1. **Describe el problema que resuelve** — No solo la solución, sino el problema de fondo
2. **Propón una implementación** — Si tienes ideas de cómo implementarlo, inclúyelas
3. **Etiqueta como `enhancement`** para facilitar el filtrado

---

## Cómo Enviar Pull Requests

### Proceso

```bash
# 1. Fork el repositorio
# 2. Clona tu fork localmente
git clone https://github.com/tu-usuario/scrumban-app.git
cd scrumban-app

# 3. Crea una rama con nombre descriptivo
git checkout -b feat/nombre-de-la-funcionalidad
# o
git checkout -b fix/descripcion-del-bug

# 4. Haz tus cambios
# 5. Asegúrate de que el linter pase
npm run lint

# 6. Haz commit con mensaje descriptivo
git add .
git commit -m "feat: agregar exportación a CSV"

# 7. Push a tu fork
git push origin feat/nombre-de-la-funcionalidad

# 8. Abre un Pull Request desde GitHub
```

### Convención de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

| Tipo | Ejemplo |
|------|---------|
| `feat` | `feat: agregar columna de prioridad al tablero` |
| `fix` | `fix: corregir error al guardar historia vacía` |
| `refactor` | `refactor: simplificar lógica de filtros` |
| `style` | `style: ajustar espaciado del sidebar` |
| `docs` | `docs: actualizar guía de despliegue` |
| `chore` | `chore: actualizar dependencias` |

### Checklist antes del PR

- [ ] El código sigue el estilo del proyecto
- [ ] No hay errores de linter (`npm run lint`)
- [ ] Los cambios son compatibles con modo local y cloud
- [ ] No se rompen funcionalidades existentes
- [ ] Los mensajes de commit siguen la convención

---

## Estilo de Código

### JavaScript

- **Punto y coma:** Sí, al final de cada instrucción
- **Comillas:** Simples (`'texto'`) para strings, dobles para JSON
- **Indentación:** 2 espacios
- **Nombres de variables:** `camelCase` para variables y funciones
- **Nombres de clases:** `PascalCase`
- **Async/Await:** Preferir sobre Promesas .then()
- **Arrow functions:** Usar `=>` para callbacks
- **Variables:** Preferir `const` sobre `let`. `var` solo cuando sea necesario por hoisting

```js
// Correcto
const users = await repo.getUsers();
const active = users.filter(u => u.status === 'active');

// Incorrecto
var users = repo.getUsers();
var active = [];
for (var i = 0; i < users.length; i++) {
  if (users[i].status == 'active') active.push(users[i]);
}
```

### HTML/CSS

- **Clases:** `kebab-case` (ej: `project-list`, `btn-primary`)
- **IDs:** `camelCase` (ej: `projectList`, `authOverlay`)
- **Variables CSS:** Usar `--nombre-variable`
- **Responsive:** Mobile-first, breakpoints a 768px y 1024px
- **Tema:** Soportar `data-theme="dark"` y `data-theme="light"`

### Linter

El proyecto usa ESLint:

```bash
npm run lint        # Verificar errores
npm run lint:fix    # Corregir automáticamente
```

---

## Configuración del Entorno de Desarrollo

### Requisitos

- Node.js 18+
- npm 9+

### Pasos

```bash
# 1. Clonar
git clone https://github.com/tu-usuario/scrumban-app.git
cd scrumban-app

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
npm run dev

# 4. Abrir en navegador
# http://localhost:3737
```

### Modos de ejecución

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor en modo desarrollo |
| `npm run lint` | Ejecuta ESLint |
| `npm run lint:fix` | Corrige errores automáticamente |
| `npm run electron-start` | Inicia versión de escritorio |
| `npm run build` | Genera instalador de escritorio |

### Modo local vs cloud

- **Modo local** (por defecto): Datos guardados en `proyectos/` como archivos JSON. Sin autenticación.
- **Modo cloud:** Requiere MongoDB. Copia `.env.example` a `.env` y completa `MONGO_URI`.

---

## Estructura del Proyecto

```
scrumban-app/
├── public/              # Frontend estático
│   ├── index.html       # SPA principal
│   ├── css/
│   │   └── style.css    # Estilos
│   ├── js/
│   │   ├── app.js       # Lógica principal del frontend
│   │   ├── icons.js     # SVG icons
│   │   └── avatar.js    # Generación de avatares
│   ├── sitemap.xml
│   ├── robots.txt
│   ├── manifest.json
│   └── browserconfig.xml
├── routes/              # Rutas de API adicionales
├── proyectos/           # Datos en modo local (JSON)
│   └── index.json       # Índice de proyectos
├── electron/            # Configuración de Electron
│   └── main.js
├── server.js            # Servidor Express principal
├── auth-service.js      # Autenticación JWT
├── file-repo.js         # Repositorio de archivos (modo local)
├── mongo-repo.js        # Repositorio MongoDB (modo cloud)
├── cli.js               # CLI para importación
├── .env.example         # Ejemplo de variables de entorno
├── package.json
├── DEPLOY.md            # Guía de despliegue
├── CONTRIBUTING.md      # Esta guía
└── CHECKLIST-LANZAMIENTO.md
```

---

## Código de Conducta

Sé respetuoso, inclusivo y constructivo. Esto es un proyecto _open source_ hecho con cariño — tratemos a todos como nos gustaría ser tratados.

---

*¿Dudas? Abre un [discussion](https://github.com/tu-usuario/scrumban-app/discussions) o un issue.*
