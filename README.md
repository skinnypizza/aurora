<div align="center">
  <br/>
  <img src="public/og-image.png" alt="Scrumban Banner" width="600" style="border-radius:12px"/>
  <br/>
  <h1>SCRUMBAN <span style="color:#6366f1">AURORA</span></h1>
  <p><strong>Gestión ágil de proyectos — Scrum + Kanban en español</strong></p>

  <p>
    <a href="#-features"><img src="https://img.shields.io/badge/Scrum-%2B%20Kanban-6366f1?style=for-the-badge" alt="Scrum+Kanban"/></a>
    <a href="#-quick-start"><img src="https://img.shields.io/badge/Zero%20Config-JSON%20Storage-10b981?style=for-the-badge" alt="Zero Config"/></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge" alt="MIT License"/></a>
  </p>
  <p>
    <a href="https://github.com/skinnypizza/aurora/releases"><img src="https://img.shields.io/github/v/release/skinnypizza/aurora?style=flat-square&label=Release&color=6366f1" alt="Release"/></a>
    <a href="https://github.com/skinnypizza/aurora/stargazers"><img src="https://img.shields.io/github/stars/skinnypizza/aurora?style=flat-square&label=Stars&color=f59e0b" alt="Stars"/></a>
    <a href="https://github.com/skinnypizza/aurora/issues"><img src="https://img.shields.io/github/issues/skinnypizza/aurora?style=flat-square&label=Issues&color=ef4444" alt="Issues"/></a>
    <a href="https://opencollective.com/scrumban"><img src="https://img.shields.io/opencollective/all/scrumban?style=flat-square&label=OpenCollective&color=10b981" alt="OpenCollective"/></a>
  </p>
  <p>
    <a href="https://twitter.com/ScrumbanApp"><img src="https://img.shields.io/badge/X-%40ScrumbanApp-000000?style=flat-square&logo=x" alt="Twitter X"/></a>
    <a href="https://discord.gg/scrumban"><img src="https://img.shields.io/badge/Discord-Join-5865F2?style=flat-square&logo=discord" alt="Discord"/></a>
    <a href="https://scrumban.app"><img src="https://img.shields.io/badge/Web-scrumban.app-6366f1?style=flat-square" alt="Web"/></a>
  </p>
  <br/>
</div>

---

**Scrumban** es una herramienta de gestión de proyectos que combina la planificación estructurada de **Scrum** con la flexibilidad visual de **Kanban**. Diseñada para equipos pequeños, freelancers y startups en LATAM. Liviana, en español, y sin necesidad de infraestructura compleja.

| 🚀 Característica | 📦 Local (Free) | ☁️ Cloud (Pro) | 🏢 Enterprise |
|---|---|---|---|
| Almacenamiento | Archivos JSON | MongoDB Atlas | Dedicado |
| Setup | `npm start` | 1 clic en Railway | Personalizado |
| Precio | **$0** | **$9 USD/mes** | Custom |
| Colaboración | 1 usuario | Hasta 8 miembros | Ilimitado |

---

## ✨ Features

| | |
|---|---|
| 🎯 **Scrumban Híbrido** | Tablero Kanban con planificación de Sprints integrada |
| 📂 **Zero Config** | Almacenamiento local en JSON. Sin servidor, sin DB, sin internet |
| 🌎 **Español LATAM** | UI y términos pensados para la forma de trabajar en Latinoamérica |
| 📊 **MoSCoW + Story Points** | Priorización real con Must/Should/Could/Wont y estimación ágil |
| 🤖 **IA Integrada** | Sugerencias inteligentes para historias de usuario y estimaciones |
| 🖥️ **Multiplataforma** | Web App + Desktop (Electron) + PWA |
| 🌙 **Tema Oscuro/Claro** | Interfaz adaptable con diseño minimalista Aurora |
| 📤 **Exportación** | Markdown, JSON, CSV, API |
| 🔄 **Sincronización Cloud** | Tu tablero disponible desde cualquier dispositivo |

<details>
<summary><b>📸 Screenshots (click para expandir)</b></summary>
<br/>
<p align="center">
  <img src="https://via.placeholder.com/800x450/171f33/6366f1?text=Scrumban+Board" alt="Board" width="800" style="border-radius:8px"/>
  <br/>
  <br/>
  <img src="https://via.placeholder.com/800x450/171f33/10b981?text=Backlog+Sprint+Planning" alt="Backlog" width="800" style="border-radius:8px"/>
  <br/>
  <br/>
  <img src="https://via.placeholder.com/800x450/171f33/f59e0b?text=Metrics+%26+Velocity" alt="Metrics" width="800" style="border-radius:8px"/>
</p>
</details>

---

## ⚡ Quick Start

```bash
# 1. Clona el repositorio
git clone https://github.com/skinnypizza/aurora.git
cd scrumban-app

# 2. Instala dependencias
npm install

# 3. ¡Ejecuta!
npm start
```

Abre [http://localhost:3737](http://localhost:3737) y empieza a gestionar tus proyectos al instante.

### 🖥️ Desktop App (Electron)

```bash
npm run electron-start
```

### ☁️ Modo Cloud (con MongoDB)

```bash
# Configura variables de entorno
cp .env.example .env
# Edita .env con tu MONGO_URI y JWT_SECRET
npm start
```

---

## 🏗️ Stack Tecnológico

```
Frontend         │  Vanilla JS · CSS3 · HTML5 · SVG Icons
Backend          │  Node.js · Express · JWT · Rate Limiting
Almacenamiento   │  File System (JSON) · MongoDB (opcional)
Desktop          │  Electron · Electron Builder
Pagos            │  Stripe · Mercado Pago · OpenCollective
CI/CD            │  GitHub Actions · Railway
```

---

## 💎 Planes

| | **Free** | **Pro** | **Enterprise** |
|---|---|---|---|
| **Precio** | $0 | $9/mo ($99/año) | Custom |
| **Proyectos** | 1 | 10 | Ilimitados |
| **Miembros** | 1 | 8 | Ilimitados |
| **Almacenamiento** | Local (JSON) | Cloud + Local | Cloud dedicado |
| **IA Sugerencias** | 10/mes | Ilimitadas | Ilimitadas + Premium |
| **Métricas** | Básicas | Avanzadas (CFD, Lead Time) | Completas + API |
| **Exportación** | Markdown | CSV/JSON/Markdown | Todos + API |
| **Columnas Personalizadas** | — | ✅ | ✅ |
| **Sincronización Cloud** | — | ✅ | ✅ |
| **Backups Automáticos** | — | ✅ | Cada 6h |
| **White-Label** | — | — | ✅ |
| **Soporte** | Comunidad | Prioritario 72h | Dedicado 24h + SLA |

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Revisa [`CONTRIBUTING.md`](CONTRIBUTING.md) para empezar.

1. Haz [Fork](https://github.com/skinnypizza/aurora/fork) del repo
2. Crea tu rama: `git checkout -b feature/mi-feature`
3. Commit: `git commit -m 'feat: agregar mi feature'`
4. Push: `git push origin feature/mi-feature`
5. Abre un [Pull Request](https://github.com/skinnypizza/aurora/compare)

---

## 💖 Apoya el Proyecto

Scrumban es **open source** y siempre lo será. Si te es útil, considera apoyarnos:

<p align="center">
  <a href="https://opencollective.com/scrumban">
    <img src="https://img.shields.io/badge/OpenCollective-Donate-7FADF2?style=for-the-badge&logo=opencollective" alt="OpenCollective"/>
  </a>
  <a href="https://github.com/sponsors/skinnypizza">
    <img src="https://img.shields.io/badge/GitHub-Sponsors-EA4AAA?style=for-the-badge&logo=githubsponsors" alt="GitHub Sponsors"/>
  </a>
</p>

---

## 📄 Licencia

MIT © 2026 — Hecho con ❤️ para la comunidad LATAM

<p align="center">
  <img src="https://img.shields.io/github/last-commit/skinnypizza/aurora?style=flat-square&color=6366f1" alt="Last Commit"/>
  <img src="https://img.shields.io/github/repo-size/skinnypizza/aurora?style=flat-square&color=10b981" alt="Repo Size"/>
  <img src="https://img.shields.io/github/languages/top/skinnypizza/aurora?style=flat-square&color=f59e0b" alt="Top Language"/>
</p>
