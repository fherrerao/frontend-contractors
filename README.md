# Frontend - Gestion de Contratistas

Aplicacion web en React 19 + Vite + TanStack Start (modo SPA) con Ant Design 6, TanStack Router y TanStack Query. Consume la API de `backend-contractors`.

## Puesta en marcha

```bash
cp .env.example .env   # VITE_API_URL=http://localhost:3001/api
npm install
npm run dev            # http://localhost:3000
```

El backend debe estar corriendo (ver su README). Usuarios de prueba: `admin@contractors.local`, `aprobador@contractors.local` y `contratista@contractors.local`, todos con la contrasena `Admin123*`.

## Funcionalidad

- Login con opcion "Recordar sesion" (localStorage o sessionStorage) y redireccion a la pagina solicitada.
- Layout con menu lateral colapsable en escritorio y menu en Drawer en movil; opciones filtradas por rol.
- Dashboard con indicadores y documentos proximos a vencer.
- Contratistas: listado con busqueda y filtro por estado, ficha con checklist de documentos.
- Subida y reemplazo de documentos con fecha de vencimiento cuando aplica.
- Cola de revision con visor de PDF/imagen y aprobacion o rechazo con comentario.
- Historial de revisiones por documento.
- Administracion de usuarios y tipos de documento.
- Tema claro/oscuro.

## Estructura (diseno atomico)

```
src/
  components/
    atoms/       envoltorios minimos de antd (AppButton, AppInput, StatusTag, RoleTag, AppAvatar, ...)
    molecules/   combinaciones de atomos (FormField, SearchBar, UserMenu, FileUploadField, StatCard, DocumentItem, ...)
    organisms/   secciones completas (SideMenu, AppHeader, LoginForm, ContractorsTable, DocumentChecklist, ReviewModal, ...)
    templates/   esqueletos de pagina (AuthTemplate, DashboardTemplate)
  hooks/         hooks de React Query por recurso
  lib/           cliente API, sesion, auth, tipos y etiquetas
  theme/         tokens de antd y proveedor de tema
  routes/        paginas (enrutado por archivos)
    login.tsx
    _app.tsx               layout protegido
    _app/index.tsx         dashboard
    _app/contractors/      listado y ficha
    _app/reviews.tsx
    _app/admin/            usuarios y tipos de documento
```

Las paginas solo componen templates y organisms y conectan los datos.

## Scripts

```bash
npm run dev               # servidor de desarrollo
npm run build             # build de produccion
npm run lint              # eslint
npm run generate-routes   # regenera src/routeTree.gen.ts
```
