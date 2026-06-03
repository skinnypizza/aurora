# Guía de Despliegue — Scrumban App

> **Versión:** 1.0  
> **Idioma:** Español  
> **Última actualización:** Junio 2026

---

## Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Variables de Entorno](#variables-de-entorno)
3. [Opción A: Railway (Recomendado para Principiantes)](#opción-a-railway-recomendado-para-principiantes)
4. [Opción B: Render](#opción-b-render)
5. [Opción C: VPS (DigitalOcean, etc.)](#opción-c-vps-digitalocean-etc)
6. [Configuración de Dominio Personalizado](#configuración-de-dominio-personalizado)
7. [SSL/HTTPS](#sslhttps)
8. [Solución de Problemas](#solución-de-problemas)
9. [Desglose de Costos](#desglose-de-costos)

---

## Requisitos Previos

- **Cuenta en GitHub** ([github.com](https://github.com/signup))
- **Node.js 18+** instalado localmente (`node --version`)
- **Git** instalado localmente (`git --version`)
- Opcional: **Cuenta en MongoDB Atlas** ([atlas.mongodb.com](https://atlas.mongodb.com)) para modo cloud

---

## Variables de Entorno

| Variable | Obligatoria | Descripción | Valor por Defecto |
|----------|-------------|-------------|-------------------|
| `PORT` | No | Puerto del servidor | `3737` |
| `MONGO_URI` | No (modo local) | Cadena de conexión a MongoDB | — |
| `MONGO_DB` | No | Nombre de la base de datos | `scrumban` |
| `JWT_SECRET` | Para cloud | Secreto para firmar JWT | — |
| `STRIPE_SECRET_KEY` | No | Clave secreta de Stripe | — |
| `STRIPE_WEBHOOK_SECRET` | No | Secreto del webhook de Stripe | — |
| `STRIPE_PRO_PRICE_ID` | No | ID del precio Pro en Stripe | — |
| `CORS_ORIGIN` | No | Origen permitido para CORS | `*` |
| `NODE_ENV` | No | Entorno de ejecución | `development` |
| `USE_LOCAL_MODE` | No | Forzar modo local | `true` |

### Generar un JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado y asígnalo a `JWT_SECRET` en tu panel de Railway/Render.

### Ejemplo de .env para producción (cloud)

```env
PORT=3737
NODE_ENV=production
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/?retryWrites=true&w=majority
MONGO_DB=scrumban
JWT_SECRET=tu_secreto_generado_aqui
CORS_ORIGIN=https://tudominio.com
```

### Ejemplo de .env para producción (local)

```env
PORT=3737
NODE_ENV=production
USE_LOCAL_MODE=true
CORS_ORIGIN=https://tudominio.com
```

---

## Opción A: Railway (Recomendado para Principiantes)

### Paso 1: Subir el código a GitHub

```bash
# Inicializar git (si no lo has hecho)
git init
git add .
git commit -m "Primer commit"

# Crear un repositorio en GitHub y luego:
git remote add origin https://github.com/tu-usuario/scrumban-app.git
git branch -M main
git push -u origin main
```

### Paso 2: Crear cuenta en Railway

1. Ve a [railway.app](https://railway.app) y regístrate (puedes usar GitHub)
2. Haz clic en **"New Project"** → **"Deploy from GitHub repo"**
3. Selecciona el repositorio `scrumban-app`

### Paso 3: Configurar variables de entorno

1. En el dashboard de tu proyecto, ve a la pestaña **"Variables"**
2. Agrega las siguientes variables:

```
NODE_ENV=production
PORT=3737
USE_LOCAL_MODE=true
```

> **Importante:** Si usas MongoDB, agrega también `MONGO_URI`, `MONGO_DB`, `JWT_SECRET` y `CORS_ORIGIN`.

### Paso 4: Configurar el comando de inicio

Railway detecta automáticamente Node.js. Si es necesario, verifica que en **"Settings"** → **"Start Command"** esté:

```bash
node server.js
```

### Paso 5: Desplegar

Railway desplegará automáticamente. Para redeploy manual:

1. Ve a la pestaña **"Deployments"**
2. Haz clic en **"Redeploy"**

O simplemente haz `git push` y Railway redeploy automáticamente.

### Paso 6: Verificar el despliegue

Railway asigna una URL tipo `https://scrumban-app.up.railway.app`. Ábrela en tu navegador.

<!-- ![Screenshot: Proyecto desplegado en Railway](https://via.placeholder.com/800x400?text=Railway+Deploy+Success) -->

### Paso 7: Configurar dominio personalizado

1. Ve a **"Settings"** → **"Domains"** → **"Custom Domain"**
2. Ingresa tu dominio (ej: `app.tudominio.com`)
3. Agrega el registro CNAME en tu proveedor DNS apuntando a `tu-proyecto.up.railway.app`
4. Railway maneja SSL automáticamente (certificados Let's Encrypt)

---

## Opción B: Render

### Paso 1: Subir el código a GitHub

Sigue los mismos pasos que en Railway (Opción A, Paso 1).

### Paso 2: Crear cuenta en Render

1. Ve a [render.com](https://render.com) y regístrate
2. Haz clic en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub

### Paso 3: Configurar el servicio

Completa los siguientes campos:

| Campo | Valor |
|-------|-------|
| **Name** | `scrumban-app` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | Free o Starter ($7/mes) |

### Paso 4: Configurar variables de entorno

En la sección **"Environment Variables"**, agrega:

```
NODE_ENV=production
PORT=3737
USE_LOCAL_MODE=true
```

<!-- ![Screenshot: Configuración de variables en Render](https://via.placeholder.com/800x400?text=Render+Environment+Variables) -->

### Paso 5: Desplegar

Haz clic en **"Create Web Service"**. Render construirá y desplegará automáticamente.

Para actualizar, haz `git push` a la rama conectada, o ve a **"Manual Deploy"** → **"Deploy latest commit"**.

### Paso 6: Verificar

Render asigna una URL tipo `https://scrumban-app.onrender.com`. Ábrela.

### Paso 7: Dominio personalizado y SSL

1. Ve a **"Settings"** → **"Custom Domain"**
2. Agrega tu dominio
3. Agrega el registro CNAME en tu DNS apuntando a `scrumban-app.onrender.com`
4. Render emite SSL automáticamente (certificados Let's Encrypt)

---

## Opción C: VPS (DigitalOcean, etc.)

### Paso 1: Configurar el servidor

Conéctate a tu VPS por SSH:

```bash
ssh root@tu-ip
```

### Paso 2: Instalar Node.js 20+

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs git nginx
node --version
npm --version
```

### Paso 3: Clonar el repositorio

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/tu-usuario/scrumban-app.git
cd scrumban-app
npm install --production
```

### Paso 4: Crear archivo .env

```bash
nano .env
```

Contenido:

```env
NODE_ENV=production
PORT=3737
USE_LOCAL_MODE=true
CORS_ORIGIN=https://tudominio.com
```

<!-- ![Screenshot: Editor nano con .env](https://via.placeholder.com/800x400?text=.env+file+in+VPS) -->

> **Nota:** Si usas MongoDB, carga el archivo .env completo con `MONGO_URI`, `JWT_SECRET` y `CORS_ORIGIN`.

### Paso 5: Instalar y configurar PM2

PM2 mantiene la aplicación corriendo y la reinicia si falla.

```bash
npm install -g pm2

# Iniciar la app
pm2 start server.js --name scrumban-app

# Que PM2 inicie automáticamente al reiniciar el servidor
pm2 startup systemd
pm2 save
```

Comandos útiles de PM2:

```bash
pm2 status                  # Ver estado
pm2 logs scrumban-app       # Ver logs
pm2 restart scrumban-app    # Reiniciar
pm2 stop scrumban-app       # Detener
```

### Paso 6: Configurar Nginx como proxy inverso

```bash
nano /etc/nginx/sites-available/scrumban-app
```

Contenido:

```nginx
server {
    listen 80;
    server_name app.tudominio.com;

    location / {
        proxy_pass http://localhost:3737;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Límite de tamaño de archivos
    client_max_body_size 10M;
}
```

Habilitar el sitio:

```bash
ln -s /etc/nginx/sites-available/scrumban-app /etc/nginx/sites-enabled/
nginx -t          # Verificar sintaxis
systemctl restart nginx
```

<!-- ![Screenshot: Nginx configurado correctamente](https://via.placeholder.com/800x400?text=Nginx+Configuration) -->

### Paso 7: Configurar SSL con Certbot

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d app.tudominio.com
```

Sigue las instrucciones interactivas. Certbot:

- Obtiene certificados de Let's Encrypt
- Configura HTTPS automáticamente
- Programa renovación automática cada 60 días

Verificar renovación automática:

```bash
certbot renew --dry-run
```

### Paso 8: Configurar firewall (opcional pero recomendado)

```bash
ufw allow 22/tcp          # SSH
ufw allow 80/tcp          # HTTP
ufw allow 443/tcp         # HTTPS
ufw enable
```

### Paso 9: Verificar

Abre `https://app.tudominio.com` en tu navegador.

---

## Configuración de Dominio Personalizado

### Resumen rápido según plataforma

| Plataforma | Tipo de Registro | Apunta a |
|------------|------------------|----------|
| Railway | CNAME | `tu-proyecto.up.railway.app` |
| Render | CNAME | `scrumban-app.onrender.com` |
| VPS | A | `IP de tu servidor` |

### Pasos generales

1. Ve a la configuración DNS de tu proveedor (Namecheap, Cloudflare, GoDaddy, etc.)
2. Agrega un registro **CNAME** (o **A** para VPS):
   - **Nombre:** `app` (para `app.tudominio.com`) o `@` (para dominio raíz)
   - **Valor:** La URL que te asignó Railway/Render, o la IP de tu VPS
   - **TTL:** 300 (5 minutos) o el valor por defecto
3. Espera 5–30 minutos para la propagación DNS

### Usando Cloudflare (recomendado)

Cloudflare ofrece CDN, protección DDoS y SSL flexible:

1. Agrega tu dominio a Cloudflare
2. Cambia los nameservers en tu proveedor a los de Cloudflare
3. Crea un registro CNAME:
   - **Name:** `app`
   - **Target:** `tu-proyecto.up.railway.app` (o IP del VPS)
   - **Proxy status:** `Proxied` (naranja)
4. En SSL/TLS → **Full (strict)**

<!-- ![Screenshot: Cloudflare DNS config](https://via.placeholder.com/800x400?text=Cloudflare+DNS+Configuration) -->

---

## SSL/HTTPS

### Railway y Render

Ambos proveen SSL automático con Let's Encrypt. No requiere configuración adicional.

### VPS con Certbot

Ya cubierto en el Paso 7 de la Opción C. Resumen:

```bash
certbot --nginx -d app.tudominio.com
```

### Verificar SSL

```bash
curl -I https://app.tudominio.com
# Debe responder con 200 OK
```

O usa [SSL Labs](https://www.ssllabs.com/ssltest/) para un análisis completo.

---

## Solución de Problemas

### La app no inicia

```
Error: Cannot find module 'dotenv'
```

**Solución:** Ejecuta `npm install` en el directorio de la app.

### Error de conexión a MongoDB

```
MongoServerSelectionError: connect ECONNREFUSED
```

**Solución:**
1. Verifica que la IP de tu servidor esté en la whitelist de MongoDB Atlas (Network Access → Add IP Address)
2. Verifica que `MONGO_URI` y `MONGO_DB` estén correctos
3. La app funciona en **modo local** sin MongoDB — solo omite `MONGO_URI`

### La página carga en blanco

**Solución:**
1. Abre las herramientas de desarrollador (F12)
2. Revisa la consola en busca de errores
3. Verifica que el `CORS_ORIGIN` coincida con tu dominio
4. Asegúrate de que el `start_url` en `manifest.json` apunte a `/`

### Error 502 Bad Gateway (Nginx)

**Solución:**
1. Verifica que PM2 esté corriendo: `pm2 status`
2. Verifica logs: `pm2 logs scrumban-app`
3. Verifica que el puerto 3737 esté escuchando: `ss -tlnp | grep 3737`
4. Reinicia Nginx: `systemctl restart nginx`

### Error 429 Too Many Requests

El rate limiter bloquea después de 20 intentos de login en 15 minutos. Espera 15 minutos o reinicia el servidor.

### Modo local no funciona en producción

Asegúrate de que `USE_LOCAL_MODE=true` esté en las variables de entorno. Sin `MONGO_URI`, la app usa modo local automáticamente.

### Los cambios no se reflejan después de hacer git push

**Railway/Render:** Revisa los logs de despliegue. A veces falla la build silenciosamente.

**VPS:** Haz pull manual:

```bash
cd /var/www/scrumban-app
git pull origin main
npm install --production
pm2 restart scrumban-app
```

---

## Desglose de Costos

| Recurso | Plan Gratuito | Plan de Pago |
|---------|---------------|--------------|
| **Railway** | $0/mes (limitado a $5 de crédito) | ~$5/mes (Starter) |
| **Render** | $0/mes (se duerme tras inactividad) | ~$7/mes (Starter) |
| **DigitalOcean VPS** | — | ~$6/mes (Basic Droplet) |
| **MongoDB Atlas** | $0/mes (512 MB, compartido) | ~$9/mes (M2) |
| **Dominio (.com)** | — | ~$10/año |
| **Cloudflare** | $0/mes (CDN + SSL) | ~$20/mes (Pro) |

### Configuración más económica

1. **Railway** ($5/mes) + **MongoDB Atlas Free** ($0/mes) + **Cloudflare** ($0/mes) + **Dominio** (~$0.83/mes)
2. **Total: ~$5.83/mes**

### Configuración con VPS

1. **DigitalOcean** ($6/mes) + **MongoDB Atlas Free** ($0/mes) + **Cloudflare** ($0/mes) + **Dominio** (~$0.83/mes)
2. **Total: ~$6.83/mes**

### Alternativa completamente gratuita

1. **Render** ($0/mes — se duerme tras 15 min de inactividad)
2. Modo local (sin MongoDB)
3. **Total: $0/mes**

---

## Notas Adicionales

- **Electron:** La app también se distribuye como aplicación de escritorio. Para construir el instalador: `npm run build`
- **Modo local:** En modo local no se requiere MongoDB ni autenticación. Todos los datos se guardan como archivos JSON en `proyectos/`
- **Actualizaciones:** Siempre haz `git pull` y `npm install` antes de reiniciar para asegurar que las dependencias estén actualizadas

---

*¿Encontraste un problema? [Abre un issue](https://github.com/tu-usuario/scrumban-app/issues) o contribuye con un PR.*
