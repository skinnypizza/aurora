# Estrategia de Monetización — Scrumban App Aurora

> **Documento v1.0** — Junio 2026
> **Propósito:** Definir el modelo de ingresos, precios, y plan de implementación comercial para Scrumban App.
> **Coordinación:** Este documento debe leerse junto con la Estrategia de Marketing.

---

## Índice

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Modelos de Monetización](#2-modelos-de-monetización)
3. [Planes y Precios](#3-planes-y-precios)
4. [Feature Gating (Bloqueo de Funcionalidades)](#4-feature-gating)
5. [Procesamiento de Pagos](#5-procesamiento-de-pagos)
6. [Cronograma de Monetización](#6-cronograma-de-monetización)
7. [Proyecciones de Ingresos](#7-proyecciones-de-ingresos)
8. [Ingresos Alternativos](#8-ingresos-alternativos)
9. [Consideraciones Éticas](#9-consideraciones-éticas)
10. [Coordinación con Marketing](#10-coordinación-con-marketing)

---

## 1. Resumen Ejecutivo

Scrumban App está en una posición única en el mercado: es un gestor de proyectos ligero con almacenamiento basado en archivos (sin base de datos), UI en español, y un modelo híbrido Scrum+Kanban. El público objetivo son equipos pequeños (3-10 personas), freelancers, startups, y equipos universitarios en LATAM.

**Modelo recomendado:** **Freemium con suscripción SaaS** como núcleo, complementado con **licenciamiento white-label** para consultorías y **donaciones/patronato** vía OpenCollective para la comunidad open-source.

**Principio rector:** El modo local (file-based, sin cuenta) siempre será gratuito. El valor de pago está en la nube (sincronización, colaboración en tiempo real, IA, equipo multi-usuario).

---

## 2. Modelos de Monetización

### 2.1 Evaluación de Modelos

| Modelo | Viabilidad | Esfuerzo Técnico | Ingreso Potencial | Recomendación |
|--------|-----------|-------------------|-------------------|---------------|
| **Freemium** | Alta | Medio | Alto | ✅ **Modelo principal** |
| **SaaS mensual** | Alta | Medio (facturación) | Alto | ✅ **Modelo principal** |
| **Compra única** | Media | Bajo | Bajo (sin recurrencia) | ❌ No recomendado |
| **Donaciones/Patronato** | Alta | Bajo | Medio (comunitario) | ✅ **Complementario** |
| **White-label** | Media | Alto (multi-tenant) | Alto (B2B) | ✅ **Fase 3** |
| **Consultoría** | Alta | Bajo | Alto | ✅ **Complementario** |
| **Publicidad** | Baja | Medio | Bajo | ❌ Daña UX |

### 2.2 Modelo Recomendado: Freemium + SaaS + White-Label

```
Ingresos objetivo (madurez): 70% SaaS · 20% White-Label · 10% Donaciones/Consultoría
```

**Por qué este mix funciona para Scrumban:**
- El **modo local gratuito** es el mejor embudo de conversión: los usuarios prueban toda la funcionalidad sin riesgo.
- El **SaaS** resuelve el dolor real (colaboración en equipo, sync multiplataforma, backup en la nube).
- El **white-label** apunta a consultorías ágiles y academias que quieren revender la herramienta con su marca.

---

## 3. Planes y Precios

### 3.1 Tabla de Planes

| Característica | Free (Local) | Pro (Cloud) | Enterprise (Cloud) |
|---------------|-------------|-------------|-------------------|
| **Precio (USD/mes)** | $0 | $9 USD/mes ($99/año) | Custom ($29-99 USD/mes) |
| **Precio (MXN/mes)** | $0 | $179 MXN/mes ($1,799/año) | Custom ($599-1,999 MXN/mes) |
| **Facturación** | — | Mensual o anual (2 meses gratis) | Anual con contrato |
| **Almacenamiento** | Local (archivos JSON) | Cloud (MongoDB) + Local | Cloud dedicado + Local |
| **Proyectos** | 1 proyecto | 10 proyectos | Ilimitados |
| **Miembros de equipo** | 1 (usuario local) | Hasta 8 miembros | Ilimitados |
| **Miembros IA locales** | Ilimitados | Ilimitados | Ilimitados |
| **Sprints** | Ilimitados | Ilimitados | Ilimitados |
| **Columnas personalizadas** | ❌ | ✅ | ✅ |
| **Sincronización cloud** | ❌ | ✅ | ✅ |
| **Planificación asistida por IA** | 10 sugerencias/mes | Ilimitado | Ilimitado + modelo premium |
| **Métricas avanzadas** | Básicas (velocidad, MoSCoW) | Completas (burnup, CFD, lead time) | Completas + exportación API |
| **Exportación** | Markdown | Markdown + CSV + JSON | Todos los formatos + API |
| **Soporte** | Comunidad (GitHub Issues) | Email prioritario (72h) | Dedicado (24h) + SLA |
| **White-label** | ❌ | ❌ | ✅ (marca personalizada) |
| **Backups automáticos** | ❌ | ✅ (diarios) | ✅ (cada 6h + on-demand) |
| **Webhooks / API** | ❌ | 1,000 req/día | 10,000 req/día |

### 3.2 Justificación de Precios (Mercado Mexicano)

**Análisis de competencia en México:**
- **Trello** (gratuito con limitaciones): $5 USD/mo (Standard) · $10 USD/mo (Premium)
- **Notion** (gratuito generoso): $10 USD/mo (Plus)
- **ClickUp** (gratuito muy completo): $7 USD/mo (Unlimited)
- **Jira** (muy caro para equipos pequeños): $7.75 USD/mo (Standard)

**Estrategia de precio:** Posicionarse como la alternativa económica pero completa.
- **$179 MXN/mes** (~$9 USD) está por debajo del promedio de competidores en LATAM.
- Descuento anual efectivo: ~$150 MXN/mes ($1,799/año = 16% de ahorro).
- **Precio psicológico:** $179 MXN (no $200) para mercado mexicano.

**Meses gratis en plan anual:** Ofrecer 2 meses gratis (paga 10, recibe 12) para incentivar pago anual.

### 3.3 Plan de Introducción de Precios (Lanzamiento)

```
Mes 1-3:  Free + Early Adopter (Pro a $4.99 USD / $99 MXN)
Mes 4-6:  Free + Pro Early ($6.99 USD / $139 MXN)
Mes 7+:   Free + Pro Full ($9 USD / $179 MXN) + Enterprise
```

---

## 4. Feature Gating

### 4.1 Mecanismo Técnico

El feature gating debe implementarse del lado del servidor (no confiar en el frontend).

**Arquitectura sugerida:**

```
┌─────────────────────────────────────────────┐
│  Plan del usuario (Free / Pro / Enterprise)  │
│  Almacenado en: JWT + colección `subscriptions` │
├─────────────────────────────────────────────┤
│  Middleware `gate(feature)` en Express:       │
│  - Verifica el plan del usuario              │
│  - Devuelve 403 si no tiene acceso           │
└─────────────────────────────────────────────┘
```

**Implementación con MongoDB:**
```js
// Colección: subscriptions
{
  userId: ObjectId,
  plan: 'free' | 'pro' | 'enterprise',
  stripeCustomerId: String,
  features: ['cloud_sync', 'ai_unlimited', 'exports'],
  expiresAt: Date,
  createdAt: Date
}
```

### 4.2 Matriz de Features por Plan

| Funcionalidad | Free | Pro | Enterprise | Código de Gate |
|--------------|------|-----|-----------|----------------|
| Modo local (file-based) | ✅ | ✅ | ✅ | — (siempre libre) |
| 1 proyecto | ✅ | ✅ | ✅ | `project_limit: 1` |
| 10 proyectos | ❌ | ✅ | ✅ | `project_limit: 10` |
| Proyectos ilimitados | ❌ | ❌ | ✅ | `project_limit: -1` |
| 1 miembro cloud | ✅ | ✅ | ✅ | `team_limit: 1` |
| 8 miembros cloud | ❌ | ✅ | ✅ | `team_limit: 8` |
| Miembros cloud ilimitados | ❌ | ❌ | ✅ | `team_limit: -1` |
| Sincronización cloud | ❌ | ✅ | ✅ | `cloud_sync` |
| Sugerencias IA (10/mes) | ✅ | ✅ | ✅ | `ai_suggestions: 10` |
| Sugerencias IA ilimitadas | ❌ | ✅ | ✅ | `ai_suggestions: -1` |
| Columnas personalizadas | ❌ | ✅ | ✅ | `custom_columns` |
| Métricas avanzadas | ❌ | ✅ | ✅ | `advanced_metrics` |
| Exportación CSV/JSON | ❌ | ✅ | ✅ | `exports` |
| Exportación API | ❌ | ❌ | ✅ | `api_exports` |
| Backups automáticos | ❌ | ✅ | ✅ | `auto_backups` |
| White-label | ❌ | ❌ | ✅ | `white_label` |
| Webhooks | ❌ | Limitado | Ilimitado | `webhooks` |
| Soporte prioritario | ❌ | ✅ | ✅ | `priority_support` |
| SLA | ❌ | ❌ | ✅ | `sla` |

### 4.3 Experiencia de Upgrade (UX)

Cuando un usuario free intente usar una feature bloqueada:
1. Mostrar un **tooltip/modal informativo** (no blocker agresivo)
2. Explicar el beneficio de la feature y cómo desbloquearla
3. Botón "Actualizar a Pro" con precio claro
4. Opción "Seguir en modo gratuito" sin presión

**Ejemplo de mensaje:**
```
"🔄 Sincronización en la nube
Sube tu tablero a la nube para acceder desde cualquier dispositivo
y colaborar con tu equipo en tiempo real.

Plan Pro: $179 MXN/mes
→ Actualizar ahora
→ Seguir en modo local"
```

---

## 5. Procesamiento de Pagos

### 5.1 Proveedores Recomendados para LATAM

| Proveedor | Comisión | LATAM | Recurrencia | Recomendación |
|-----------|----------|-------|-------------|---------------|
| **Stripe** | 2.9% + $0.30 | ✅ (MX, BR, CO, CL, AR) | ✅ Sí | ✅ **Primario (internacional)** |
| **Mercado Pago** | 3.9% + IVA | ✅ (MX, BR, AR, CO) | ✅ Sí | ✅ **Primario (México/LATAM)** |
| **PayPal** | 4.4% + $0.30 | ✅ (toda LATAM) | ✅ Sí | ⚠️ **Respaldo** |
| **OpenCollective** | 0% (comisión de plataforma 10%) | ✅ Global | ✅ Donaciones | ✅ **Donaciones** |
| **Kofi** | 0% (comisión $0) | ✅ Global | ❌ No | ✅ **Propinas/one-time** |
| **Conekta** | 3.6% + IVA | ❌ Solo MX | ✅ Sí | ❌ Muy limitado |

### 5.2 Implementación Recomendada

**Stack de pagos:**
```
Stripe (principal, tarjetas internacionales)
  └── Stripe Tax (cálculo automático de IVA global)
  └── Stripe Customer Portal (autogestión de suscripción)
Mercado Pago (México, pagos en OXXO, SPEI, tarjetas locales)
OpenCollective (donaciones recurrentes, transparencia open-source)
```

**Flujo de suscripción:**
1. Usuario hace clic en "Actualizar a Pro"
2. Backend crea `checkout session` en Stripe/Mercado Pago
3. Redirección a página de pago
4. Webhook confirma pago (`checkout.session.completed`)
5. Backend actualiza `subscriptions` en MongoDB
6. JWT se refresca con nuevo plan (o se verifica en cada request)

**Código de webhook (Stripe):**
```js
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId } = session.metadata;
    await db.collection('subscriptions').updateOne(
      { userId: new ObjectId(userId) },
      { $set: { plan: 'pro', stripeCustomerId: session.customer } }
    );
  }
  res.json({ received: true });
});
```

### 5.3 Precios Regionales

| País | Moneda | Pro Mensual | Pro Anual | Enterprise |
|------|--------|-------------|-----------|------------|
| **México** | MXN | $179 | $1,799 | Contacto |
| **Colombia** | COP | $35,000 | $350,000 | Contacto |
| **Argentina** | ARS | $8,000 | $80,000 | Contacto |
| **Chile** | CLP | $8,500 | $85,000 | Contacto |
| **Perú** | PEN | S/33 | S/330 | Contacto |
| **Estados Unidos** | USD | $9 | $99 | Contacto |
| **Europa** | EUR | €8 | €89 | Contacto |

---

## 6. Cronograma de Monetización

### 6.1 Fase 1: Construcción de Audiencia (Mes 1-3)

**Objetivo:** Usuarios, tracción, feedback.

| Actividad | Métrica | Semana |
|-----------|---------|--------|
| Lanzamiento v1.0 (solo modo local, 100% gratis) | 100 usuarios | S1 |
| Publicación en Product Hunt / SimilarWeb | 500 visitas | S2 |
| Crear comunidad en GitHub Discussions + Discord | 50 miembros | S3 |
| Campaña en r/programacion, r/mexico, grupos de devs | 300 usuarios | S4 |
| Integración OpenCollective (donaciones voluntarias) | $50/mes | S6 |
| Survey a usuarios: "¿Cuánto pagarías por cloud sync?" | 50 respuestas | S8 |
| Implementar feature flags (preparar gating) | — | S10 |
| **Hito:** **1,000 usuarios activos (MAU)** | | **S12** |

**Inversión:** $0 (todo el código existe, solo esfuerzo de comunidad)

### 6.2 Fase 2: Introducción de Planes de Pago (Mes 4-6)

**Objetivo:** Primeros ingresos recurrentes.

| Actividad | Métrica | Semana |
|-----------|---------|--------|
| Lanzar cloud sync (MVP: MongoDB + auth existente) | — | S14 |
| Activar registro de usuarios cloud | 50 registros | S15 |
| Precio Early Adopter ($4.99 USD / $99 MXN) | 10 suscriptores | S16 |
| Implementar Mercado Pago + Stripe | — | S18 |
| Lanzar plan Pro Early ($6.99 / $139 MXN) | 30 suscriptores | S20 |
| Campaña de email a usuarios free (conversión) | 5% tasa de conversión | S22 |
| **Hito:** **$500 MRR** | | **S24** |

### 6.3 Fase 3: Expansión (Mes 7-12)

**Objetivo:** Crecimiento sostenible y nuevos canales.

| Actividad | Métrica | Semana |
|-----------|---------|--------|
| Precios finales ($9 / $179 MXN) | — | S26 |
| Lanzar plan Enterprise (página de contacto) | 2 clientes enterprise | S28 |
| Implementar white-label (personalización de marca) | 1 cliente WL | S30 |
| Lanzar API pública + webhooks (valor enterprise) | — | S32 |
| Programa de referidos (1 mes gratis por referido) | 10% crecimiento | S34 |
| Partnerships: academias de coding, consultorías ágiles | 3 partners | S38 |
| Versión Electron desktop (compilación offline) | — | S40 |
| **Hito:** **$5,000 MRR · 5,000 MAU** | | **S48** |

---

## 7. Proyecciones de Ingresos

### 7.1 Escenarios (12 Meses)

| Escenario | MAU (Free) | Suscriptores Pro | Conversión | Clientes Enterprise | MRR (USD) | ARR (USD) |
|-----------|-----------|-----------------|-----------|-------------------|-----------|-----------|
| **Conservador** | 3,000 | 60 | 2% | 2 | $600 | $7,200 |
| **Moderado** | 5,000 | 200 | 4% | 5 | $1,950 | $23,400 |
| **Optimista** | 10,000 | 600 | 6% | 12 | $5,700 | $68,400 |
| **Agresivo** | 20,000 | 1,600 | 8% | 25 | $14,700 | $176,400 |

### 7.2 Proyección Mes a Mes (Escenario Moderado)

| Mes | MAU | Free | Pro (pagos) | Enterprise | MRR | Donaciones | Total Mensual |
|-----|-----|------|------------|-----------|-----|-----------|--------------|
| 1 | 100 | 100 | 0 | 0 | $0 | $0 | $0 |
| 2 | 300 | 300 | 0 | 0 | $0 | $5 | $5 |
| 3 | 600 | 600 | 0 | 0 | $0 | $10 | $10 |
| 4 | 1,000 | 980 | 20 | 0 | $180 | $15 | $195 |
| 5 | 1,500 | 1,460 | 40 | 0 | $360 | $20 | $380 |
| 6 | 2,000 | 1,930 | 70 | 0 | $630 | $30 | $660 |
| 7 | 2,500 | 2,390 | 105 | 1 | $975 | $40 | $1,015 |
| 8 | 3,000 | 2,845 | 145 | 2 | $1,365 | $50 | $1,415 |
| 9 | 3,500 | 3,300 | 185 | 3 | $1,755 | $60 | $1,815 |
| 10 | 4,000 | 3,750 | 230 | 4 | $2,160 | $75 | $2,235 |
| 11 | 4,500 | 4,195 | 280 | 5 | $2,610 | $90 | $2,700 |
| 12 | 5,000 | 4,585 | 350 | 7 | $3,240 | $110 | $3,350 |

### 7.3 Supuestos

- Tasa de conversión free → pro: 5-7% (referencia: Dropbox 4%, Trello 3%, Notion 5%)
- Churn mensual: 5% (típico para SaaS B2B pequeño)
- Enterprise: ciclo de venta de 30-60 días, contratos anuales de $500-2,000 USD
- Donaciones: $0.02 por usuario activo mensual (OpenCollective benchmark)

### 7.4 Costos Estimados

| Concepto | Free | Pro | Enterprise | Mensual (5k MAU) |
|---------|------|-----|-----------|-----------------|
| MongoDB Atlas (M10) | — | Compartido | Dedicado | $57 USD |
| Stripe fees (2.9% + $0.30) | — | $0.56/suscripción | — | $200 |
| Mercado Pago fees (3.9% + IVA) | — | $1.15/suscripción MXN | — | $100 |
| Hosting (Railway / Render) | $7 | Incluido | Incluido | $7 (free tier) + $25 |
| Dominio + Email | $10/mes | — | — | $10 |
| OpenAI API (sugerencias IA) | ~$0.01/sugerencia | ~$0.01/sugerencia | ~$0.01/sugerencia | $50 (10k sugerencias) |
| **Total** | | | | **~$450 USD/mes** |

**Margen bruto estimado (mes 12, escenario moderado):**
- Ingresos: $3,350/mes
- Costos: ~$450/mes
- **Margen: ~87%**

---

## 8. Ingresos Alternativos

### 8.1 Consultoría e Implementación

Ofrecer servicios profesionales alrededor de la herramienta:

| Servicio | Precio | Descripción |
|----------|--------|-------------|
| Setup de Scrumban para equipos | $500 USD | Sesión de 2h para configurar proyectos, WIP limits, MoSCoW |
| Migración desde Jira/Trello/Asana | $300-1,000 USD | Script + asistencia para migrar datos |
| Capacitación ágil + Scrumban | $200 USD/hora | Workshop para equipos, online |
| Taller "Scrumban para startups" | $1,500 USD | 4 sesiones, incluye setup y acompañamiento |
| Desarrollo de integración custom | $2,000-5,000 USD | API, webhooks, integración con Slack/GitHub/Notion |

**Canal:** LinkedIn, clusters de innovación, incubadoras de startups (ej. Startup México, UTEC Ventures).

### 8.2 Licenciamiento White-Label

Consultorías ágiles y academias de coding pueden revender Scrumban con su marca.

| Partner | Caso de Uso | Precio Sugerido |
|---------|-------------|-----------------|
| Consultoría ágil | Implementar Scrumban en clientes con su branding | $50 USD/mes por cada 10 clientes finales |
| Academia de coding | Alumnos gestionan proyectos con la herramienta de la academia | $100 USD/mes por hasta 200 alumnos |
| Empresa interna | Departamento de TI despliega internamente | $200 USD/mes (instancia dedicada) |

**Requisito técnico:** Tema personalizable, logo, dominio propio, eliminar "Powered by Scrumban".

### 8.3 Workshops y Contenido

- **Webinars mensuales:** "Scrumban en acción" — $10 USD entrada
- **Curso grabado:** "Metodología Scrumban para equipos remotos" — $30 USD
- **Plantillas premium:** Configuraciones de proyecto para industrias específicas (dev, marketing, diseño) — $5-15 USD c/u

### 8.4 Sponsorships

- **GitHub Sponsors:** Para desarrolladores que contribuyen al código
- **OpenCollective:** Transparente, para costos de infraestructura
- **Patreon:** Contenido exclusivo (roadmap anticipado, votación de features)

---

## 9. Consideraciones Éticas

### 9.1 Principios

```
1. El modo local (sin cuenta, sin internet) es SAGRADO — siempre gratuito.
2. No usar dark patterns (contadores falsos de urgencia, precios engañosos).
3. Los early adopters reciben un trato especial (precio congelado de por vida).
4. Transparencia total sobre qué datos se almacenan en la nube.
5. Derecho a exportar y eliminar datos en cualquier momento (GDPR-ready).
```

### 9.2 Dark Patterns a Evitar

| Práctica | Decisión |
|----------|----------|
| "Solo quedan 3 lugares en el plan Pro" | ❌ **No implementar** (falso — es SaaS digital) |
| Contador regresivo en precios | ❌ **No implementar** (falso sentido de urgencia) |
| Botón de pago más grande/destacado que "seguir gratis" | ❌ **No implementar** |
| Cancelación difícil (oculta o con múltiples pasos) | ❌ **No implementar** — cancelación en 1 clic |
| Degradación de funcionalidad gratis (quitar features existentes) | ❌ **No implementar** — lo gratuito se congela, no se degrada |

### 9.3 Trato a Early Adopters

Todos los usuarios que se registren durante la Fase 1 (primeros 1,000 usuarios):
- **Plan Pro gratis por 6 meses** al lanzar suscripciones
- **Precio congelado de por vida:** Si compran Pro, pagan siempre $4.99 USD (nunca sube)
- **Badge "Founder Edition"** en su perfil (reconocimiento público)

### 9.4 Privacidad y Datos

- El modo local **no envía ningún dato a servidores externos** (ni siquiera analytics)
- En modo cloud, informar explícitamente qué se almacena:
  - ✅ Datos del proyecto (historias, sprints, equipo)
  - ✅ Email y nombre
  - ❌ Contenido de mensajes internos
  - ❌ Archivos adjuntos locales
- Opción de **auto-destrucción de cuenta**: eliminar todos los datos cloud en 1 clic

### 9.5 Accesibilidad

- Free trial del plan Pro: **30 días sin tarjeta de crédito**
- Descuento educativo: **50% off** para estudiantes y universidades (verificación con email .edu o equivalente LATAM)
- Sin límite de tiempo en modo local: un usuario puede usar Scrumban local por años sin pagar

---

## 10. Coordinación con Marketing

### 10.1 Posicionamiento de Precios

**Mensaje clave:**
> "Scrumban es la herramienta ágil más liviana que existe. Úsala localmente sin pagar nada. Cuando necesites colaborar con tu equipo, actualízate por $179 MXN/mes."

**Ángulos de comunicación:**

| Audiencia | Mensaje | Canal |
|-----------|---------|-------|
| Freelancers | "Tu tablero personal, siempre gratis. Sin cuentas, sin internet." | Twitter/X, LinkedIn, grupos de devs |
| Startups pequeñas | "Colabora con tu equipo sin la pesadilla de Jira. $179 MXN/mes por hasta 8 personas." | Product Hunt, Hacker News, Reddit |
| Universidades | "Gestión ágil para tus proyectos finales. Descuento educativo del 50%." | Ferias universitarias, grupos de estudiantes |
| Consultorías | "Implementa Scrumban con tus clientes bajo tu propia marca." | LinkedIn, email directo, eventos de agilidad |
| Empresas | "Scrumban Enterprise: despliegue privado, SLA, soporte dedicado." | Contacto directo, referidos |

### 10.2 Página de Precios (Copy)

**Headers sugeridos:**

```
Gratis. Siempre.
Sin tarjeta de crédito. Sin límite de tiempo.
↓
$0 — Modo Local
✔ Tablero completo con drag & drop
✔ Backlog + Sprints + Métricas
✔ 1 proyecto · Modo offline
✔ Importar/Exportar JSON
```

```
Para equipos que crecen.
$179 MXN / mes (o $1,799/año — ahorra 16%)
↓
Pro — Cloud
Todo lo de Free, más:
✔ Sincronización cloud en tiempo real
✔ Hasta 10 proyectos
✔ Hasta 8 miembros de equipo
✔ Sugerencias IA ilimitadas
✔ Métricas avanzadas (CFD, Lead Time)
✔ Backups automáticos diarios
✔ Soporte prioritario
```

```
Para organizaciones.
Precio personalizado
↓
Enterprise
Todo lo de Pro, más:
✔ Proyectos y miembros ilimitados
✔ White-label (tu marca)
✔ API pública + Webhooks
✔ SLA 99.9% · Soporte 24h
✔ Despliegue privado
✔ Onboarding dedicado
```

### 10.3 Embudos de Conversión

**Embudo primario: Free → Pro**
```
Landing page → User prueba modo local (100%)
  → Quiere colaborar con equipo (40%)
    → Ve modal de upgrade (15%)
      → Checkout → Paga → Pro (5-7%)
```

**Embudo secundario: Pro → Enterprise**
```
Equipo Pro llega a 8 miembros (20%)
  → Necesita más slots (5%)
    → Contacta ventas (2%)
      → Contrato Enterprise (0.5%)
```

### 10.4 Campañas por Fase

**Fase 1 (Construcción):**
- Contenido: Blog posts sobre metodología Scrumban vs Scrum vs Kanban
- Redes: Comparativas, memes de gestión ágil, casos de uso
- SEO: "herramienta scrumban gratis", "tablero kanban español", "gestión proyectos simple"

**Fase 2 (Lanzamiento Pro):**
- Email marketing: "Ya puedes llevar tu tablero a la nube"
- Landing page de precios con tabla comparativa
- Post en Product Hunt: "Scrumban Cloud — tu tablero ágil ahora sincronizado"
- Webinar: "De local a cloud: cómo migrar tu proyecto Scrumban"

**Fase 3 (Expansión):**
- Casos de éxito: "Cómo [Startup X] gestiona 5 equipos con Scrumban Enterprise"
- Programa de embajadores: Usuarios Pro reciben código de referido
- Partnerships: Integraciones con Slack, GitHub, GitLab

### 10.5 Preguntas Frecuentes (FAQ de Precios)

| Pregunta | Respuesta |
|----------|-----------|
| ¿Puedo seguir usando modo local después de actualizar? | Sí. Tu proyecto local y cloud son independientes. Puedes tener ambos. |
| ¿Qué pasa si cancelo mi suscripción? | Tu proyecto cloud se congela (solo lectura) por 30 días. Puedes exportar tus datos en cualquier momento. Vuelves a modo local sin perder nada. |
| ¿Hay descuento por volumen? | Sí. Contacta a ventas para equipos de 10+ personas. |
| ¿Aceptan OXXO / depósitos? | Sí, vía Mercado Pago. Puedes pagar en efectivo en OXXO, 7-Eleven, o transferencia SPEI. |
| ¿Los datos están en México? | Sí. Usamos MongoDB Atlas con región `azure-northcentral` (Querétaro, MX). |
| ¿Puedo pagar en USD desde otro país? | Sí, vía Stripe. |
| ¿Hay reembolso? | Sí, 14 días sin preguntas. |

---

## Apéndice A: Resumen de Acciones

| # | Acción | Responsable | Deadline |
|---|--------|------------|----------|
| 1 | Implementar feature flags (`gate()` middleware) | Dev | Fase 1 |
| 2 | Integrar OpenCollective para donaciones | Dev | Fase 1 |
| 3 | Crear landing page de precios | Marketing + Dev | Fase 2 |
| 4 | Integrar Stripe + Mercado Pago | Dev | Fase 2 |
| 5 | Implementar webhooks de suscripción | Dev | Fase 2 |
| 6 | Activar descuento early adopters | Marketing | Fase 2 |
| 7 | Lanzar página Enterprise | Marketing | Fase 3 |
| 8 | Implementar white-label | Dev | Fase 3 |
| 9 | Lanzar API pública | Dev | Fase 3 |
| 10 | Programa de referidos | Marketing | Fase 3 |

## Apéndice B: KPIs a Monitorear

| KPI | Fórmula | Target (12 meses) |
|-----|---------|-------------------|
| MAU (Monthly Active Users) | Usuarios únicos que usan la app en 30d | 5,000 |
| Tasa de conversión | Suscriptores / MAU | 5% |
| MRR | Ingresos recurrentes mensuales | $3,000+ |
| ARPU | MRR / MAU | $0.60 |
| Churn mensual | Cancelaciones / suscriptores activos | <5% |
| CAC (Costo de Adquisición) | Gasto marketing / nuevos suscriptores | <$10 |
| LTV (Life Time Value) | ARPU promedio / churn | $180 |
| Net Promoter Score (NPS) | Encuesta trimestral | 40+ |
| Tasa de activación | % registrados que completan onboarding | 60% |
| DAU/MAU Ratio | Daily / Monthly active users | 20% |

---

> **Documento generado:** 2026-06-03
> **Próxima revisión:** 2026-09-03 (trimestral)
> **Coordinación:** Revisar con equipo de marketing antes de implementar cualquier cambio de precios.
