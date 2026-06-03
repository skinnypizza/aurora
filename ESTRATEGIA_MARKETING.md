# Estrategia de Marketing — Scrumban App

> **Versión:** 1.0  
> **Producto:** Scrumban App — Tablero ágil híbrido (Scrum + Kanban)  
> **Idioma objetivo:** Hispanohablantes (equipos de software, freelancers, startups)  
> **Presupuesto:** Bootstrapped (~$0–200/mes)

---

## 1. Público Objetivo

### Persona Primaria: "La Lead Técnica"
- **Perfil:** Tech Lead / Scrum Master / PM de un equipo pequeño (3–12 personas)
- **Dolor:** Jira es demasiado pesado; Trello es muy simple; Notion requiere armar todo desde cero
- **Busca:** Algo que funcione ya, con sprints y kanban, sin configuración infinita
- **Idioma:** Prefiere herramientas en español (o al menos que estén disponibles)
- **Canales:** Reddit (r/programacion, r/devsarg), LinkedIn, Dev.to, comunidades tech de LATAM

### Persona Secundaria: "El Freelancer Organizado"
- **Perfil:** Desarrollador freelance, da servicios a 2–3 clientes simultáneos
- **Dolor:** Necesita separar proyectos, priorizar tareas, estimar esfuerzo sin pagar suscripciones caras
- **Busca:** Almacenamiento local (JSON), multi-proyecto, portátil (Electron), gratuito
- **Idioma:** Español nativo, valora que la UI esté en su idioma

### Persona Terciaria: "El Estudiante/Equipo Universitario"
- **Perfil:** Grupos de facultad que cursan Ingeniería de Software, Metodologías Ágiles
- **Dolor:** Usan herramientas gratuitas limitadas o planillas de Excel
- **Busca:** Practicar Scrum con un tablero real, entender velocity y sprints
- **Valor:** Zero setup, corre local, ideal para trabajos prácticos

---

## 2. Propuesta de Valor (Value Proposition)

| Aspecto | Scrumban App | Jira | Trello | Notion | Linear |
|---|---|---|---|---|---|
| Setup | Archivos JSON, 0 DB | Requiere servidor/config | Cuenta online | Cuenta online | Cuenta online |
| Metodología | Scrumban nativo | Sprints complejos | Kanban plano | Flexible (armalo) | Sprints lineales |
| Offline/Portable | Sí (Electron + local) | No | Limitado | Limitado | No |
| En español | Sí (toda la UI) | Parcial | Parcial | Parcial | No |
| Precio | Gratis / auto-hosted | $$$$ | $$ | $$ | $$$ |
| IA integrada | Sugerencias nativas | Sí (costo extra) | No | Sí (pago) | No |
| MoSCoW + SP | Sí | Sí (complejo) | No | Con plugins | No |

### Frase de posicionamiento (tagline):
> *"Gestión ágil de proyectos sin complicaciones. Scrum + Kanban en un tablero liviano, en español y con almacenamiento local."*

---

## 3. Canales de Distribución

### 3.1 Gratuitos (prioridad alta)

| Canal | Estrategia | Frecuencia |
|---|---|---|
| **GitHub** | Repositorio público con README atractivo, issues etiquetadas para contribuidores | Diario (actividad) |
| **Reddit** | r/programacion, r/devsarg, r/taquerosprogramadores, r/agile, r/scrumban | 2–3 posts/semana |
| **Dev.to** | Tutoriales técnicos en español (cómo montar Scrumban, casos de uso) | 1 artículo/semana |
| **LinkedIn** | Publicaciones de producto, casos de uso, screenshots; conectar con PMs | 3–4 posts/semana |
| **Twitter/X** | Hilos cortos de consejos ágiles + valor del producto | 1 thread/día |
| **Product Hunt** | Lanzamiento oficial (ver sección 5) | Una vez |
| **Hacker News** | Show HN con foco técnico (Node.js + Vanilla JS + Electron) | Una vez |
| **Indie Hackers** | Historia de desarrollo, tech stack, monetización futura | 1 post/mes |
| **WhatsApp / Telegram** | Grupos de devs LATAM (compartir link, pedir feedback) | Semanal |
| **YouTube** | Demo rápida (1–2 min) del tablero funcionando | 1 video/quincena |

### 3.2 De bajo costo ($)

| Canal | Costo estimado | Acción |
|---|---|---|
| Google Ads (keywords long-tail: "tablero kanban español", "scrumban gratis") | $50/mes | Campaña acotada |
| Facebook/Instagram Ads | $50/mes | Apuntar a público tech en LATAM |
| Newsletter (Substack o Beehiiv free tier) | $0 | Newsletter semanal "Ágil en Español" |

---

## 4. Estrategia de Contenido

### 4.1 Blog Posts (Dev.to / Medium / Blog propio)

| # | Título | Target | Keyword |
|---|---|---|---|
| 1 | "Scrumban: qué es, cómo funciona y por qué tu equipo debería usarlo" | Leads técnicas | `scrumban` |
| 2 | "Adiós Jira: cómo migrar a una herramienta liviana con almacenamiento local" | Tech leads frustrados | `alternativa a jira` |
| 3 | "Kanban vs Scrum vs Scrumban: guía para equipos indecisos" | Equipos nuevos | `diferencias scrum kanban` |
| 4 | "Cómo gestionar proyectos de software sin pagar un peso" | Freelancers | `gestión proyectos gratis` |
| 5 | "Story Points vs Horas: cuándo usar cada uno" | Equipos ágiles | `story points estimación` |
| 6 | "Planificación de sprints para equipos pequeños" | Startups | `sprint planning equipo pequeño` |
| 7 | "5 herramientas de gestión ágil que deberías conocer en 2025" | Comparativa | `herramientas ágiles` |
| 8 | "Cómo ejecutar Scrumban con archivos JSON (sin servidor, sin DB)" | Devs técnicos | `scrum con json` |

### 4.2 Tutoriales Técnicos

- **"Cómo instalar Scrumban App en 2 minutos"** (vídeo + texto)
- **"Deploy en Railway/Render gratis"** (guía paso a paso)
- **"Usa Scrumban App como Progressive Web App"**
- **"Importa tus datos desde Trello/Jira a Scrumban"** (script migración)

### 4.3 Comparativas

- Scrumban App vs Trello (gana en sprints, MoSCoW, SP)
- Scrumban App vs Linear (gana en precio, español, offline)
- Scrumban App vs Jira (gana en simplicidad, setup, costo)
- Scrumban App vs Notion (gana en enfoque ágil, velocidad)

### 4.4 Demo Videos

- **30s demo**: Tablero drag & drop + creación de historia
- **60s demo**: Planificación de sprint + velocity chart
- **15s clip**: Dark/Light theme toggle (visual hook)
- **TikTok/Reels**: "Tu jira pero sin pagar" — clips virales cortos

---

## 5. Estrategia de Lanzamiento

### 5.1 Pre-Lanzamiento (Días -30 a -7)

| Objetivo | Acción | Métrica |
|---|---|---|
| Generar expectativa | Publicar sneak peek UI en Twitter/LinkedIn | Impresiones, shares |
| Captar leads tempranos | Crear landing con waitlist (Google Forms o Carrd gratis) | Emails recolectados |
| Construir comunidad | Abrir Discord o Telegram para early adopters | Miembros en comunidad |
| Obtener feedback | Invitar a 10–20 leads técnicas a probar beta privada | Issues reportadas |
| SEO temprano | Publicar artículos base (los 8 del plan) | Rankings en Google |

**Landing mínima (Carrd gratuito):**
- Hero: "Scrumban App — El tablero ágil que habla español"
- Features: 3 bullets + screenshot
- CTA: "Únete a la lista de espera"
- Footer: Link a GitHub + Twitter

### 5.2 Lanzamiento (Día 0)

| Canal | Acción | Horario |
|---|---|---|
| **Product Hunt** | Publicar producto (focus: "Scrumban para equipos hispanohablantes") | 00:01 PT |
| **Hacker News** | "Show HN: Scrumban Board – Scrum + Kanban con JSON storage" | 08:00 ET |
| **Reddit** | Post en r/programacion + r/agile + r/SideProject | 10:00 MX |
| **Twitter/X** | Hilo de lanzamiento (15 tweets) + video demo | 09:00 MX |
| **LinkedIn** | Publicación con carrusel de screenshots | 10:00 MX |
| **Dev.to** | Artículo "Lancé una herramienta de gestión ágil en español" | 12:00 MX |
| **Indie Hackers** | Post "From zero to launch: mi herramienta scrumban" | 14:00 MX |
| **Comunidades WhatsApp/Telegram** | Compartir link + pedir upvote en PH | 10:00 MX |

**Checklist para Product Hunt:**
- [ ] Banner principal (1280×720) con UI de la app
- [ ] Demo GIF del tablero funcionando
- [ ] Pricing claro: "Gratis / Open Source"
- [ ] Maker comment detallando tech stack y motivación
- [ ] Tags: "Project Management", "Open Source", "SaaS", "Developer Tools"
- [ ] Pedir a la comunidad early adopter que dejen support comments

### 5.3 Post-Lanzamiento (Días +1 a +30)

| Objetivo | Acción |
|---|---|
| Mantener momentum | Agradecer a todos los users, responder comments |
| Convertir visitas | Email a la waitlist anunciando que ya está disponible |
| SEO | Publicar artículos de seguimiento ("Resultados del launch") |
| Feature requests | Recopilar y priorizar en GitHub issues |
| Versión Electron | Anunciar app desktop descargable |
| Primeros testimonios | Pedir a early adopters que dejen reseña / testimonial |

---

## 6. Tácticas de Crecimiento

### 6.1 Programa de Referidos (Sistema manual/low-code)

- **Mecánica:** "Compartí Scrumban con un colega. Cuando se registre, ambos obtienen features exclusivos"
- **Recompensa:** Acceso anticipado a funcionalidades premium (exportación avanzada, temas extra, etc.)
- **Herramienta:** Bitly + planilla manual, o ReferralCandy si escala

### 6.2 Comunidad Open Source

| Acción | Impacto |
|---|---|
| README con shields, badges, demo GIF | Primera impresión profesional |
| CONTRIBUTING.md amigable | Atrae contribuidores novatos |
| Issues etiquetadas "good first issue" | Reduce fricción |
| GitHub Discussions activo | Comunidad se autogestiona |
| Roadmap público (Projects en GH) | Transparencia genera confianza |
| GitHub Sponsors / Buy Me a Coffee | Monetización opcional |

### 6.3 SEO para Keywords Estratégicas

| Keyword | Volumen (est.) | Dificultad | Página objetivo |
|---|---|---|---|
| `scrumban` | Bajo | Baja | Home / Blog |
| `tablero scrumban gratis` | Bajo | Baja | Landing + Blog |
| `kanban en español` | Medio | Media | Blog comparativa |
| `alternativa a jira` | Alto | Alta | Blog comparativa |
| `gestión de proyectos ágil` | Alto | Alta | Blog contenido |
| `herramienta scrum gratis` | Medio | Media | Blog tutorial |
| `software gestión proyectos open source` | Medio | Media | GitHub + Blog |

**Técnicas SEO rápidas:**
- Sitemap.xml + robots.txt
- Meta tags por página (title, description, og:image)
- Schema.org `SoftwareApplication` en la landing
- Backlinks desde Dev.to, Medium, GitHub
- Imágenes con alt text descriptivo

### 6.4 Widget / Embed Opción

- **Badge embed:** "Powered by Scrumban App" — código HTML que los usuarios pueden pegar en su web/sitio de proyecto
- **Public roadmap embed:** Los proyectos públicos de Scrumban pueden embeber su tablero como iframe

### 6.5 Alianzas Estratégicas

- **Universidades:** Contactar profesores de Ingeniería de Software que quieran una herramienta gratuita para sus alumnos
- **Comunidades dev:** Sponsor de meetups virtuales (costo: $0, dar visibilidad)
- **Cursos online:** Que instructors de Udemy/Coursera recomienden la herramienta para los trabajos prácticos

---

## 7. Guía de Marca (Branding)

### 7.1 Tono de Voz

| Situación | Tono | Ejemplo |
|---|---|---|
| Redes sociales | Cercano, humor sutil, técnico pero no críptico | "Tu Jira pero sin pagar, sin configurar servidores y en español. ¿Qué más querés?" |
| Documentación | Claro, directo, ejemplos concretos | "Clonás el repo, corrés npm install, y ya tenés tu tablero andando." |
| Blog / Artículos | Educativo, autoridad suave | "En este artículo te explico por qué el scrumban es ideal para equipos de 5 personas." |
| Emails / Newsletter | Personal, conversacional | "Hola {nombre}, esta semana lancé una feature que me pediste..." |
| Soporte | Empático, solucionador | "Entiendo que Jira te resulta pesado. Acá te muestro cómo migrar en 5 minutos." |

**Reglas de tono:**
- Usar "vos" o "tú" (definir según audiencia; LATAM prefiere "tú" en escrito formal, "vos" en informal)
- NO ser corporativo-falso
- NO exagerar (no somos "la mejor herramienta del mundo", somos "una herramienta que resuelve un problema específico")
- Sí usar emojis en redes, no en docs

### 7.2 Identidad Visual

**Logotipo:**
```
SCRUMBAN[AURORA]
```
- Marca en dos colores: blanco/neutro (SCRUMBAN) + color acento (AURORA)
- Versión simplificada: "S[B]" estilizado

**Paleta de colores:**

| Token | Hex | Uso |
|---|---|---|
| Fondo principal | `#0b1326` | Modo oscuro |
| Superficie | `#171f33` | Cards, modales |
| Acento primario | `#6366f1` | Botones, links, highlights |
| Texto principal | `#dae2fd` | Títulos, body |
| Texto secundario | `#c7c4d7` | Subtítulos |
| Success | `#10b981` | Columna Done, badges |
| Warning | `#f59e0b` | Review, alertas |
| Error | `#ef4444` | Eliminar, errores |

**Tipografía:**
- Headlines: Outfit (700–900)
- Body: Inter (400–600)
- Código/variables: Geist Mono

### 7.3 Messaging por Canal

| Canal | Mensaje principal |
|---|---|
| GitHub README | "Scrumban Board — gestión ágil de proyectos con JSON storage. Zero config, español, IA." |
| Product Hunt | "A lightweight Scrumban board for Spanish-speaking teams. Sprints, Kanban, MoSCoW, and offline mode." |
| Twitter/X | Tips ágiles + screenshots de la app + hilos de comparación |
| LinkedIn | Casos de uso, artículos de liderazgo ágil, testimonios |
| Blog | Tutoriales, comparativas, guías de metodología ágil |
| Landing | "El tablero ágil que habla español. Gratis. Open Source. Sin configuración." |

---

## 8. Timeline 90 Días

### Semanas 1–2: Preparación

- [ ] Publicar repositorio en GitHub con README pulido
- [ ] Crear landing page (Carrd o Vercel)
- [ ] Configurar waitlist (Google Forms + email automation)
- [ ] Publicar primeros 3 artículos de blog (seed content)
- [ ] Crear perfiles de Twitter/X y LinkedIn para la marca
- [ ] Invitar 20 early adopters a probar la beta

### Semanas 3–4: Construcción de Audiencia

- [ ] Publicar 1 artículo/semana en Dev.to
- [ ] Post diario en Twitter/X (hilos los fines de semana)
- [ ] Publicar 2–3 posts en Reddit (r/programacion, r/devsarg)
- [ ] Grabar y publicar 2 videos demo (30s y 60s)
- [ ] Crear el Discord/Telegram de la comunidad
- [ ] Preparar todos los assets para el launch (banners PH, screenshots)

### Semana 5: Pre-Lanzamiento

- [ ] Activar countdown en la landing
- [ ] Enviar email a waitlist "En 7 días lanzamos"
- [ ] Post teaser en todos los canales
- [ ] Coordinar con posibles supporters para PH launch
- [ ] Preparar el Show HN post

### Semana 6: LANZAMIENTO (Día 0)

- [ ] **00:01 PT** — Publicar en Product Hunt
- [ ] **08:00 ET** — Show HN en Hacker News
- [ ] **10:00 MX** — Postear en Reddit + Twitter + LinkedIn
- [ ] **12:00 MX** — Artículo en Dev.to
- [ ] **14:00 MX** — Indie Hackers post
- [ ] Todo el día — Responder comments, agradecer, compartir updates

### Semanas 7–8: Momentum Post-Launch

- [ ] Email a waitlist completa anunciando disponibilidad
- [ ] Publicar "Resultados del lanzamiento" (transparencia)
- [ ] Lanzar versión Electron (app desktop)
- [ ] Publicar guía "Cómo migrar desde Trello/Jira"
- [ ] Recopilar feedback y priorizar features

### Semanas 9–12: Crecimiento Orgánico

- [ ] Publicar contenido semanal consistente
- [ ] Outreach a universidades (profesores de metodologías ágiles)
- [ ] Comenzar campaña Google Ads (low budget)
- [ ] Implementar programa de referidos manual
- [ ] Engagement en comunidades (Reddit, Discord, Telegram)
- [ ] Publicar roadmap y pedir contribuciones open source
- [ ] Medir KPIs y ajustar estrategia

---

## 9. Consideraciones de Presupuesto

### Gastos Cero ($0)

| Recurso | Propósito |
|---|---|
| GitHub | Código, issues, discussions, actions, pages |
| Vercel / Railway | Hosting de landing/demo (free tier) |
| Carrd | Landing page simple |
| Dev.to / Medium | Blog hosting |
| Canva | Diseño de banners y screenshots |
| CapCut / DaVinci Resolve | Edición de videos |
| Bitly | Link shortening y tracking |
| Google Analytics (GA4) | Tracking de landing |
| Google Search Console | SEO |
| MailerLite (free tier) | Email marketing (hasta 1000 suscriptores) |
| Discord | Comunidad |
| OBS Studio | Grabación de pantalla para demos |

### Gastos Opcionales ($)

| Concepto | Costo | Prioridad |
|---|---|---|
| Google Ads (keyword «kanban español») | $50–100/mes | Media |
| Twitter/X Premium | $8/mes | Baja |
| Hosting propio (VPS) para demo pública | $5–10/mes | Media |
| Product Hunt launch fee | $0 (gratis) | — |
| Ilustraciones personalizadas (Fiverr) | $20–50 | Baja |
| Total estimado/mes | **$63–168/mes** | |

### Monetización Futura (no urgente)

| Modelo | Detalle |
|---|---|
| GitHub Sponsors | "Buy me a coffee" + sponsors tier |
| Donaciones voluntarias | "Support the project" en landing |
| Features premium (a futuro) | Exportación avanzada, integraciones, multi-idioma (opcional) |
| Consultoría | Ofrecer setup personalizado para equipos/empresas |

---

## KPIs para Medir Éxito

| KPI | Meta 30 días | Meta 90 días |
|---|---|---|
| GitHub stars | 100+ | 500+ |
| Usuarios registrados (cloud) | 200+ | 1000+ |
| Descargas (modo local + Electron) | 500+ | 3000+ |
| Artículos publicados | 8 | 20+ |
| Seguidores Twitter/X | 300+ | 1500+ |
| Miembros en comunidad (Discord) | 100+ | 400+ |
| PH upvotes | 100+ | — |
| Suscriptores newsletter | 200+ | 800+ |
| Tasa de conversión landing → registro | >5% | >8% |

---

## Checklist de Inicio Rápido

- [ ] Hacer público el repositorio de GitHub con README en español + inglés
- [ ] Crear landing page en Carrd con waitlist
- [ ] Publicar primer artículo en Dev.to ("Qué es Scrumban")
- [ ] Crear cuenta de Twitter/X @ScrumbanApp
- [ ] Unirse a r/programacion y r/devsarg
- [ ] Grabar demo de 30 segundos del tablero
- [ ] Configurar Google Analytics + Search Console
- [ ] Abrirコミュニティ en Discord o Telegram
- [ ] Agregar link de GitHub + contacto en la app
- [ ] Pedir feedback a 5–10 personas

---

*Documento generado para Scrumban App — Aurora Edition. Revisar y ajustar cada 30 días según datos reales.*
