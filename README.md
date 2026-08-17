# Ferretería VIP — E-commerce Scaffolding

> **Quasar 2 + Vue 3 + TypeScript + Supabase**  
> Scaffolding multi-tenant para catálogos online con pedidos por WhatsApp.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | [Quasar 2](https://v2.quasar.dev/) (CLI Vite) |
| UI Runtime | Vue 3 (Composition API, `<script setup>`) |
| Language | TypeScript (strict) |
| Backend | [Supabase](https://supabase.com/) (PostgreSQL, Auth) |
| State | Pinia (stores) + localStorage persistence |
| Router | Vue Router 4 (history mode) |
| Icons | Material Icons + Font Awesome 6 |
| Fonts | Oswald (headings), Inter (body), JetBrains Mono (prices) |
| Deploy | Vercel (SPA) |

---

## Arquitectura

### Multi-tenancy

Cada deployment se aísla por `negocio_id` leído de `VITE_NEGOCIO_ID` en `.env`.  
Todas las queries a la tabla `products` filtran por este campo.  
El admin autenticado usa su propio `negocio_id` (desde la tabla `negocios` vinculada a su user UUID).

### Capa de configuración (`src/config/`)

La personalización del negocio vive **exclusivamente** en `src/config/`, no en componentes:

| Archivo | Contenido |
|---|---|
| `branding.ts` | Nombre, logo, colores, hero CTA, información de contacto, texto "Acerca de" |
| `categories.ts` | Lista de categorías del catálogo (icono + label) |
| `whatsapp.ts` | Número de WhatsApp + plantillas de mensajes (producto, carrito, contacto) |
| `business.ts` | Lectura de `VITE_NEGOCIO_ID`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |

### Routing (`src/router/routes.ts`)

```
/
├── MainLayout            ← Público (header + footer + bottom nav)
│   ├── /                 → IndexPage (hero, categorías, shelf)
│   ├── /catalogo         → CatalogPage (grid + filtros + búsqueda)
│   ├── /contacto         → ContactPage
│   └── /acerca           → AboutPage
├── /login
│   └── AuthLayout        → LoginPage
├── /adminstore
│   └── AdminLayout       → AdminPage (requiere auth → meta.requiresAuth)
└── /:catchAll(.*)        → ErrorNotFound
```

---

## Estructura del proyecto

```
src/
├── boot/
│   ├── supabase.js       ← Cliente Supabase singleton
│   └── axios.ts          ← Cliente Axios
├── config/
│   ├── index.ts          ← Barrel export
│   ├── branding.ts       ← Nombre, colores, logo, hero, contacto
│   ├── business.ts       ← Env vars (negocio_id, supabase)
│   ├── categories.ts     ← Categorías del catálogo
│   └── whatsapp.ts       ← Número + plantillas WhatsApp
├── composables/
│   ├── index.ts          ← Barrel export
│   ├── useProducts.ts    ← CRUD productos contra Supabase
│   ├── useCatalog.ts     ← Filtrado/búsqueda local (sin DB)
│   ├── useWhatsApp.ts    ← Links de WhatsApp (producto, carrito, contacto)
│   ├── useGlobalSearch.ts ← Ref singleton para búsqueda global
│   └── useProductPreview.ts ← Ref singleton para preview modal
├── layouts/
│   ├── MainLayout.vue    ← Header + footer + bottom nav + ProductPreview + CartModal
│   ├── AdminLayout.vue   ← Header admin + drawer + notificaciones
│   ├── AuthLayout.vue    ← Layout mínimo para login
│   ├── AccountLayout.vue ← Layout con back button
│   ├── CleanLayout.vue   ← Layout alternativo (legacy, otras tiendas)
│   └── AdminChangeNotifications.vue ← Badge de cambios recientes (admin)
├── pages/
│   ├── IndexPage.vue     ← Hero + categorías + productos destacados + CTA WhatsApp
│   ├── CatalogPage.vue   ← Wrapper de CatalogView + SEO meta
│   ├── ContactPage.vue   ← Información de contacto + botón WhatsApp
│   ├── AboutPage.vue     ← Texto institucional
│   ├── LoginPage.vue     ← Formulario de login (email + password)
│   ├── AdminPage.vue     ← CRUD de productos (tabla + formulario + stats)
│   └── ErrorNotFound.vue ← 404
├── components/
│   ├── CartModal.vue     ← Modal carrito (full-screen mobile, responsive)
│   ├── ProductCard.vue   ← Card genérico de producto (legacy, para otras vistas)
│   ├── FooterBar.vue     ← Footer reutilizable con links
│   ├── MarqueeBar.vue    ← Barra de mensaje animado (marquee)
│   ├── ProductForm.vue   ← Formulario create/edit producto (admin)
│   └── catalog/
│       ├── index.ts      ← Barrel export
│       ├── CatalogView.vue   ← Integración: filtros + grid + búsqueda
│       ├── ProductCard.vue   ← Card catálogo (oferta badge, estado, add-to-cart, WhatsApp)
│       ├── ProductFilters.vue ← Chips de categorías (scroll horizontal)
│       ├── ProductGrid.vue   ← Grid de ProductCards + empty slot
│       └── ProductPreview.vue ← Modal full-screen con imagen grande + "Añadir al carrito"
├── stores/
│   ├── index.ts          ← Pinia setup
│   ├── types.ts          ← Interfaces compartidas (Product, CartItem, etc.)
│   ├── cart.ts           ← Carrito con localStorage, total en CUP
│   ├── auth.ts           ← Auth con Supabase + localStorage persist
│   └── adminChanges.ts   ← Historial de cambios CRUD (admin)
├── router/
│   ├── index.ts          ← Router setup + navigation guard (auth)
│   └── routes.ts         ← Definición de rutas
├── css/
│   └── app.scss          ← Global: animaciones, brass-rule, noise-bg, scroll-reveal
├── App.vue               ← Root component
└── env.d.ts              ← Tipados globales
```

---

## Stores (Pinia)

### `cart.ts` — Carrito

- `items: CartItem[]` — persistido en `localStorage`
- `count` — total de unidades (computed)
- `total` — suma en CUP (computed)
- `add(product, qty?)` — agrega o incrementa
- `remove(productId)` — elimina item
- `setQuantity(productId, qty)` — cambia cantidad
- `clear()` — vacía carrito

### `auth.ts` — Autenticación

- `isAuthenticated`, `negocio_id`, `user`
- `login(email, password)` → Sign In con Supabase
- `logout()` → Sign Out + limpia estado
- `initializeAuth()` → recupera sesión existente + escucha cambios
- Persistencia en `localStorage`

### `adminChanges.ts` — Historial admin

Registra operaciones CRUD con timestamp para notificaciones en el panel.

---

## Tipos compartidos (`src/stores/types.ts`)

```ts
Product     → id, name, price, image, category, estado, oferta, descuento, descripcion, new, negocio_id
CartItem    → { product: Product; quantity: number }
OrderContact → fullName, phone, address, refs?
User        → id, email, fullName?, phone?, isAdmin?
```

---

## Patrones y convenciones

### Singleton refs

Composables como `useGlobalSearch` y `useProductPreview` exportan **refs de módulo** (singleton) para compartir estado entre cualquier componente sin prop drilling.

### Filtrado local vs DB

- `useCatalog` → filtrado/búsqueda **puramente client-side** sobre un array de productos
- `useProducts` → CRUD contra Supabase (fetch, create, update, delete)
- `CatalogView` usa `useProducts.fetchProducts()` + filtrado propio por categoría y `filterQuery`

### Imágenes

Las imágenes de productos se renderizan con fallback a `/images/placeholder.svg`:

```ts
:src="product.image || '/images/placeholder.svg'"
```

### Precios

Formateo consistente con `Intl.NumberFormat('es-CU', ...)` y sufijo ` CUP`:

```ts
new Intl.NumberFormat('es-CU', {
  style: 'currency',
  currency: 'CUP',
  maximumFractionDigits: 0,
}).format(value)
```

---

## Paleta de color

| Variable | Uso | Hex |
|---|---|---|
| `primary` | Header, footer, fondos oscuros | `#0A2747` |
| `secondary` | Acentos dorados, badges activos | `#C8963E` |
| `accent` | CTA, badges oferta | `#E85D04` |
| `heroBg` | Fondo del hero | `#0C1A2E` |

---

## Animaciones

- **Hero**: `scale-in` + `fade-in` + `fade-up` con delays escalonados
- **Logo**: flotación infinita suave (`translateY(-6px)`)
- **Scroll reveal**: opacidad + translateY con `IntersectionObserver` (threshold 0.15)
- **Section reveal**: `.section-reveal.revealed` — transición 0.6s cubic-bezier
- **Categorías**: entrada escalonada con `transitionDelay` progresivo
- **Marquee**: scroll animado horizontal (15s linear infinite)
- **Reduced motion**: `prefers-reduced-motion: reduce` desactiva animaciones

---

## Responsive

| Breakpoint | Bottom nav | Shelf grid | Hero logo |
|---|---|---|---|
| `< 768px` | Visible (q-footer) | 2 columnas | 260px |
| `≥ 768px` | Oculto | 3 columnas | 380px |
| `≥ 1024px` | Oculto | 4 columnas | 420px |

El bottom nav (`q-footer` con `q-tabs`) solo se muestra en móvil (`$q.screen.lt.md`).

---

## Variables de entorno

```env
VITE_SUPABASE_URL='https://your-project.supabase.co'
VITE_SUPABASE_ANON_KEY='your-anon-key'
VITE_NEGOCIO_ID='your-business-uuid'
VITE_WHATSAPP_NUMBER='5351234567'
```

---

## Comandos

```bash
yarn dev          # Inicia servidor de desarrollo
yarn build        # Build de producción
yarn lint         # ESLint (flat config, .ts/.js/.vue)
yarn format       # Prettier
```

No hay test suite configurada.

---

## Deploy (Vercel)

Configuración en `vercel.json` para SPA con history mode.  
Las variables de entorno se setean en el dashboard de Vercel.

---

## Licencia

Este proyecto se distribuye como scaffolding genérico.  
Los derechos comerciales y de marca pertenecen a **Ferretería VIP** / **Yyd Solution**.
