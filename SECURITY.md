# Política de Seguridad — Scrumban App

## Reportar una Vulnerabilidad

Si descubres una vulnerabilidad de seguridad en Scrumban App, por favor repórtala enviando un email a **security@scrumban.app** (o abre un [issue privado](https://github.com/skinnypizza/scrumban-app/security/advisories/new)).

**No abras issues públicos para vulnerabilidades de seguridad.**

### Proceso

1. Reportas la vulnerabilidad
2. Respondemos en un plazo de **48 horas**
3. Trabajamos en una solución y la publicamos en un **parche de seguridad**
4. Te acreditamos como descubridor (si lo deseas)

### Alcance

| Versión | Soportada |
|---------|-----------|
| Última release | ✅ |
| Versiones anteriores | ❌ |

### Buenas Prácticas

- Scrumban en **modo local** no expone ningún puerto a internet
- En **modo cloud**, usa siempre HTTPS con certificado válido
- Mantén tu `JWT_SECRET` seguro y usa valores largos (64+ caracteres)
- No compartas tu `STRIPE_SECRET_KEY` ni `MONGO_URI`
