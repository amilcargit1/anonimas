# Confesiones App

Página de confesiones anónimas estilo "Confesiones" (parecido a NGL), con fondo animado de estrellas.

- Node.js + Express
- PostgreSQL (con `pg`, sin ORM)
- Panel de admin en `/admin.html`

🚀 Powered by Creador AmilcarGit · Colaborador: Danny

---

## Desplegar en Render

El proyecto incluye `render.yaml` para configurar el servicio web y PostgreSQL.

Variables de entorno:
- `DATABASE_URL`
- `ADMIN_PASSWORD`
- `PORT` (Render lo asigna automáticamente)

Páginas:
- Pública: `/`
- Panel de administración: `/admin.html`
