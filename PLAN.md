# Plan de Diseño: Ferretería VIP

> Documento de identidad visual y plan de personalización del scaffolding
> para **Ferretería VIP — Todo Incluido**.
>
> Basado en el logo real del negocio, los colores del local físico,
> y el análisis del scaffolding original (derivado de Mercado Texas).

---

## 1. El Negocio

**Ferretería VIP** es una ferretería cubana con posicionamiento premium.
Venden herramientas, materiales de construcción, pintura, electricidad,
plomería, y más. El eslogan **"Todo Incluido"** comunica que el cliente
encuentra todo en un solo lugar, con atención personalizada vía WhatsApp
y precios en CUP/USD.

---

## 2. Identidad de Marca (del logo real)

El logo es un emblema circular con relieve 3D:

| Elemento | Descripción |
|----------|-------------|
| **Icono central** | Casa con techo, ventana naranja encendida, martillo y llave fija cruzados detrás |
| **"FERRETERÍA"** | Sans-serif gruesa, mayúscula, acabado plateado/cromado |
| **"VIP"** | Textura de oro rugoso, tamaño grande, énfasis en exclusividad |
| **"TODO INCLUIDO"** | Blanco dentro de cinta/cintillo negro con bordes dorados |
| **Marco** | Círculo doble negro con borde dorado metalizado |
| **Estrellas** | 3 estrellas doradas en la base (central más grande) |

### Colores del logo y local físico

| Color | Hex | Uso en marca |
|-------|-----|--------------|
| Negro logo | `#111111` | Fondo del emblema, tipografía |
| Oro VIP | `#C8963E` | Letras "VIP", bordes, estrellas |
| Plata cromado | `#8C929A` | "FERRETERÍA", martillo, llave |
| Naranja | `#E85D04` | Ventana iluminada de la casa |
| Azul marino | `#1A1A2E` | Color del local físico |
| Blanco hueso | `#F5F3EF` | Paredes del local físico |

---

## 3. Paleta de diseño (fusionada)

Colores extraídos directamente de la marca real:

| Token | Hex | Rol |
|-------|-----|-----|
| Fondo página | `#F5F3EF` | Blanco hueso del local |
| Texto principal | `#1A1A2E` | Azul marino oscuro |
| Negro premium | `#111111` | Fondos oscuros (hero, footer) |
| Oro VIP | `#C8963E` | Acentos, títulos de marca, badges |
| Plata herramienta | `#8C929A` | Bordes, líneas divisorias, estados neutros |
| Naranja destello | `#E85D04` | CTAs, ofertas, energía |
| Superficie | `#FFFFFF` | Tarjetas, contenedores |
| Verde | `#1A936F` | Disponibilidad, positivo |

---

## 4. Tipografía

| Rol | Fuente | Detalle |
|-----|--------|---------|
| Display | **Oswald** (400/700) | Sans-serif condensada, mayúscula, muscular. Evoca "FERRETERÍA" del logo. Títulos, hero, secciones. |
| Body | **Inter** (400/500) | Neutra, legible. Descripciones, navegación, textos largos. |
| Utility | **JetBrains Mono** (400) | Precios, medidas técnicas, códigos. Como etiqueta de estante de ferretería. |

---

## 5. Firma visual: "El Dorado Industrial"

Tres gestos que conectan directamente con el logo real:

1. **Acento dorado en la marca** — "VIP" en el hero y en secciones clave va en
   `#C8963E`. Solo para la marca, sin abusar.

2. **Línea divisoria metalizada** — separadores entre secciones con gradiente
   sutil `#8C929A → #C8963E` (plata → oro), emulando el borde del emblema
   circular del logo.

3. **Tres estrellas doradas** — aparecen como separador decorativo
   exclusivamente en el footer. Marca de calidad, sin repetir en ningún otro lado.

---

## 6. Layout del Hero (página de inicio)

```
┌──────────────────────────────────────────────────────┐
│ [Logo] FERRETERÍA VIP    Inicio  Catálogo  Contacto  │
├──────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────┐ │
│ │ ████████████████████████████████████████████████ │ │
│ │ ██   [imagen de herramientas/ferretería]      ██ │ │
│ │ ██                              ┌──────────┐  ██ │ │
│ │ ██   FERRETERÍA                 │  TODO    │  ██ │ │
│ │ ██   VIP  (dorado)              │ INCLUIDO │  ██ │ │
│ │ ██                              └──────────┘  ██ │ │
│ │ ██   [Ver Catálogo]                            ██ │ │
│ │ ████████████████████████████████████████████████ │ │
│ └──────────────────────────────────────────────────┘ │
│ ═══════════════════════════════════════════════════  │
│ (línea gradiente plata→oro)                          │
│                                                      │
│         [Categorías: herramientas, pintura,          │
│          electricidad, plomería, construcción]       │
│                                                      │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │
│  │ img  │ │ img  │ │ img  │ │ img  │               │
│  │ name │ │ name │ │ name │ │ name │               │
│  │$1,500│ │$2,300│ │  $800│ │$3,200│               │
│  │ $15  │ │ $23  │ │  $8  │ │ $32  │               │
│  └──────┘ └──────┘ └──────┘ └──────┘               │
│                                                      │
│ ═══════════════════════════════════════════════════  │
│  ★ ★ ★   © Ferretería VIP                           │
└──────────────────────────────────────────────────────┘
```

- Hero con fondo oscuro (`#111111`) o imagen oscurecida de taller/ferretería
- Marca en blanco + dorado, emulando el contraste del logo sobre negro
- Badge/burbuja **"TODO INCLUIDO"** como la cinta del logo
- Sin carrusel, sin blur overlay, sin flechas de scroll animadas
- Un solo CTA: **"Ver Catálogo"**

---

## 7. Tarjeta de producto

```
┌──────────────────────┐
│       [imagen]       │
│                      │
│  ─────────────────── │ ← línea plata→oro sutil
│  MARTILLO 16OZ       │ ← Oswald, mayúscula
│  Martillo de uña     │ ← Inter, body
│  profesional acero   │
│                      │
│  ⬤ Disponible        │
│                      │
│  Precio: $950 CUP    │ ← JetBrains Mono
│  ══════════════════  │ ← línea de firma (plata→oro)
│  Precio: $9.50 USD   │ ← JetBrains Mono
│                      │
│  [WhatsApp] [Añadir] │ ← botones con bordes dorados
└──────────────────────┘
```

---

## 8. Contenido textual

### Hero
```text
FERRETERÍA
VIP            (dorado)
TODO INCLUIDO  (en badge)

Herramientas, materiales y más para tu obra
```

### Acerca de
```text
En Ferretería VIP encuentras todo lo que necesitas para tu obra,
reparación o proyecto del hogar. Herramientas, pintura, electricidad,
plomería, materiales de construcción — todo en un solo lugar.

Trabajamos con precios en CUP y USD, y puedes pedir por WhatsApp
con atención personalizada.

VIP no es solo un nombre: es cómo tratamos a cada cliente.
```

### WhatsApp (template mensajes)

| Escenario | Mensaje |
|-----------|---------|
| Producto | `Hola, me interesa: [producto] - [precio]` |
| Carrito | `Hola, quiero hacer el siguiente pedido:\n[items]\nTotal: [total]` |
| Contacto | `Hola, me gustaría obtener información sobre sus productos de ferretería.` |

---

## 9. Categorías de productos

```
- Herramientas
- Pintura
- Electricidad
- Plomería
- Construcción
- Jardín
- Seguridad
```

---

## 10. Mapeo de cambios por archivo

| Archivo | Cambio |
|---------|--------|
| `src/config/branding.ts` | nombre, slogan, hero text (Ferretería VIP / Todo Incluido), colores propios, contacto |
| `src/config/categories.ts` | categorías de ferretería |
| `src/config/whatsapp.ts` | número real, mensajes con tono ferreteril, nombre del negocio |
| `src/css/quasar.variables.scss` | paleta completa azul+oro+plata+negro+naranja |
| `src/css/app.scss` | imports de Oswald + Inter + JetBrains Mono, estilos globales, clase `.linea-vip` (gradiente) |
| `src/pages/IndexPage.vue` | hero rediseñado (fondo oscuro, badge TODO INCLUIDO, sin carrusel) |
| `src/pages/CatalogPage.vue` | layout con paleta nueva |
| `src/pages/AboutPage.vue` | texto real de ferretería |
| `src/pages/ContactPage.vue` | datos de contacto ferretería |
| `src/layouts/MainLayout.vue` | colores, ruta de logo, tipografía, nombre |
| `src/components/catalog/ProductCard.vue` | línea plata→oro como firma, tipografía Oswald, badge TODO INCLUIDO |
| `src/components/FooterBar.vue` | tres estrellas doradas, colores actualizados |
| `src/components/MarqueeBar.vue` | mensaje de ferretería |
| `src/components/CartModal.vue` | colores y tipografía actualizados |
| `quasar.config.ts` | agregar fuentes (Oswald, JetBrains Mono) a extras |
| `.env.example` | variable para negocio_id y whatsapp |

---

## 11. Lo que NO cambia (se mantiene del scaffolding)

- Toda la lógica de negocio (composables, stores, routing, Supabase)
- Estructura multi-tenant con `negocio_id`
- Flujo de WhatsApp para órdenes
- Sistema de carrito con persistencia localStorage
- Panel admin protegido por auth

---

## 12. Animación (contenida)

1. **Scroll reveal** — productos aparecen con fade + translateY (staggered 80ms)
2. **Hover en tarjetas** — la línea plata→oro se expande del centro hacia los bordes (micro-interacción)
3. **Sin** animaciones de carga, sin parallax, sin flechas rebotando

---

## 13. Principios de diseño

- **Un riesgo estético, bien ejecutado:** la línea plata→oro como firma visual.
  Si funciona, será lo que la gente recuerde del sitio. Si falla, es sutil
  y no arruina la experiencia.

- **Chanel antes de publicar:** menos decoración. Sin carrusel, sin blur
  overlay, sin flechas de scroll, sin animaciones superfluas.

- **Cada color tiene una razón:** no hay un solo color que no venga del logo
  o del local. La paleta no es intercambiable con otro negocio.

- **Mobile-first:** el grid de productos empieza en 1 columna (móvil) y
  escala a 4 columnas (escritorio). Las fuentes están optimizadas para
  legibilidad en pantallas pequeñas.
