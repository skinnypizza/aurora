# Checklist de Lanzamiento — Scrumban App

> **Idioma:** Español  
> **Versión:** 1.0  
> **Documentos relacionados:** [ESTRATEGIA_MARKETING.md](./ESTRATEGIA_MARKETING.md), [ESTRATEGIA_MONETIZACION.md](./ESTRATEGIA_MONETIZACION.md)

---

## H-7: Una Semana Antes — Pre-Lanzamiento

### Producto

- [ ] **Pruebas finales:** Verificar que todas las funcionalidades críticas funcionan
  - [ ] Crear/editar/eliminar proyectos
  - [ ] Crear/editar/mover/eliminar historias
  - [ ] Planificar y cerrar sprints
  - [ ] Modo local y modo cloud
  - [ ] Login y registro
  - [ ] Exportación a markdown
- [ ] **Renderizado responsive:** Probar en móvil, tablet y escritorio
- [ ] **Modo offline:** Verificar que el modo local funciona sin internet
- [ ] **Rendimiento:** Carga de página < 3 segundos en 3G
- [ ] **Seguridad:** Rate limiting, helmet, cookies secure

### Infraestructura

- [ ] **Despliegue en producción:** Siguiendo [DEPLOY.md](./DEPLOY.md)
  - [ ] Railway / Render / VPS configurado
  - [ ] Variables de entorno correctas
  - [ ] HTTPS funcionando (certificado SSL válido)
- [ ] **Dominio personalizado:** `app.tudominio.com` apuntando al servidor
- [ ] **MongoDB Atlas:** (si aplica) IP en whitelist, conexión verificada
- [ ] **Monitoreo básico:** Logs accesibles, health check endpoint
- [ ] **Backups:** Estrategia definida (copias de `proyectos/` o dump de MongoDB)

### SEO y Assets

- [ ] `public/robots.txt` subido y accesible (`/robots.txt`)
- [ ] `public/sitemap.xml` subido y accesible (`/sitemap.xml`)
- [ ] `public/manifest.json` subido y válido (validar con [PWABuilder](https://pwabuilder.com))
- [ ] `public/browserconfig.xml` subido
- [ ] Meta tags en `index.html` (description, og:image, twitter:card)
- [ ] Google Search Console: dominio verificado y sitemap enviado
- [ ] Iconos: 192x192, 512x512, favicon.ico

### Marketing

- [ ] Revisar [ESTRATEGIA_MARKETING.md](./ESTRATEGIA_MARKETING.md)
- [ ] **Landing page:** Mensaje claro, CTA visible, screenshots del producto
- [ ] **Post de lanzamiento:** Redactado y agendado en:
  - [ ] Reddit (r/programacion, r/devsarg, r/startups)
  - [ ] LinkedIn (artículo o post)
  - [ ] Dev.to / Medium
  - [ ] Twitter / X
- [ ] **Email list:** (opcional) Lista de early adopters lista
- [ ] **Product Hunt / Similar:** (opcional) Borrador listo
- [ ] **Demo video:** (opcional) Grabación de 1-2 min mostrando el producto

### Documentación

- [ ] README.md actualizado
- [ ] DEPLOY.md verificado (seguir los pasos desde cero)
- [ ] CONTRIBUTING.md publicado
- [ ] CHECKLIST-LANZAMIENTO.md completo (este documento)

---

## H-Hour: Día del Lanzamiento

### H-3 (mañana temprano)

- [ ] **Último deploy:** Push a producción del código final
- [ ] **Verificar HTTPS:** `https://app.tudominio.com` responde OK
- [ ] **Probar login:** Crear cuenta nueva, iniciar sesión
- [ ] **Probar modo local:** Acceder sin credenciales
- [ ] **Probar flujo completo:** Crear proyecto → agregar historias → mover a Done
- [ ] **Verificar analytics:** Script analytics.js cargando (consola del navegador)

### H-2

- [ ] **Monitoreo:** Tener logs abiertos (Railway dashboard o `pm2 logs`)
- [ ] **Alertas:** (opcional) Configurar uptime monitoring (UptimeRobot, Better Uptime)
- [ ] **Caché:** Verificar que Cloudflare (si se usa) está en modo proxied
- [ ] **CDN:** Assets estáticos cargando correctamente

### H-1

- [ ] **Publicar post de lanzamiento** en canales principales
- [ ] **Enviar a comunidades:** Reddit, grupos de Telegram/Discord, Slack communities
- [ ] **Notificar early adopters:** Email o mensaje directo a quienes probaron el beta
- [ ] **Abrir registro público:** Deshabilitar cualquier restricción de acceso

### H (Lanzamiento)

- [ ] **Verificar que todo funciona** bajo carga real
- [ ] **Monitorear errores** en consola del servidor
- [ ] **Responder comentarios** en redes sociales y comunidades
- [ ] **Mantener calma:** Es normal que surjan issues — documentarlos y priorizar

### H+2

- [ ] **Primer reporte post-lanzamiento:**
  - Usuarios registrados
  - Proyectos creados
  - Errores encontrados
  - Fuente de tráfico (de dónde vienen los visitantes)

---

## H+30: 30 Días Post-Lanzamiento

### Semana 1 (Días 1–7)

- [ ] **Bug fixing:** Priorizar issues reportados post-lanzamiento
- [ ] **Primer feedback loop:** Contactar a 3–5 usuarios activos para entrevista breve
- [ ] **Métricas tempranas:**
  - Usuarios totales
  - Usuarios activos diarios (DAU)
  - Proyectos creados
  - Historias creadas
  - Tasa de conversión (gratuito → pago, si aplica)
- [ ] **Ajustes rápidos:** Correcciones de UI/UX basadas en feedback

### Semana 2 (Días 8–14)

- [ ] **Segundo post:** "Cómo resolvimos X con Scrumban" (caso de uso real)
- [ ] **Optimización SEO:** Revisar Google Search Console, ajustar keywords
- [ ] **Rendimiento:** Analizar Core Web Vitals, optimizar si es necesario
- [ ] **Contenido:** Escribir tutorial / guía de uso (blog post o video)

### Semana 3 (Días 15–21)

- [ ] **Feature iteration:** Según feedback, priorizar próximas funcionalidades
- [ ] **Comunidad:** Responder issues, PRs abiertos, discussions
- [ ] **Analytics avanzado:** Configurar objetivo de conversión en Plausible/Umami

### Semana 4 (Días 22–30)

- [ ] **Post-mortem del lanzamiento:**
  - Qué salió bien
  - Qué salió mal
  - Qué se aprendió
  - Qué mejorar para el próximo lanzamiento
- [ ] **Roadmap público:** Publicar hoja de ruta para los próximos 3 meses
- [ ] **Métricas acumuladas:**
  - Usuarios totales: `___`
  - Proyectos activos: `___`
  - Tasa de retención (semana 1 → semana 4): `___%`
  - Fuentes de tráfico principales: `___`
  - NPS estimado (encuesta a usuarios): `___`
- [ ] **Plan de crecimiento:** Definir objetivos para el próximo mes

---

## Referencia Rápida

### URLs Importantes

| Recurso | URL |
|---------|-----|
| App en producción | `https://app.tudominio.com` |
| Repositorio | `https://github.com/tu-usuario/scrumban-app` |
| Google Search Console | `https://search.google.com/search-console` |
| PWABuilder (validar manifest) | `https://pwabuilder.com` |
| SSL Checker | `https://www.ssllabs.com/ssltest/` |
| Railway Dashboard | `https://railway.app/dashboard` |
| Render Dashboard | `https://dashboard.render.com` |
| MongoDB Atlas | `https://cloud.mongodb.com` |

### Comandos Útiles

```bash
# Ver logs en VPS
pm2 logs scrumban-app

# Ver estado en VPS
pm2 status

# Reinicio rápido
pm2 restart scrumban-app

# Health check
curl https://app.tudominio.com/api/status
```

---

*Completa cada ítem marcándolo `[x]` a medida que avanzas. Este checklist está vivo — actualízalo según tu experiencia.*
