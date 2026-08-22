# Y4Y Yamira — Todo a tu alcance

**Tienda online de productos variados**: electrodomésticos, ferretería, moda y mucho más, con atención personalizada y pedidos por WhatsApp.

Este sitio permite al cliente ver el catálogo, armar su pedido desde el celular y enviarlo directamente por WhatsApp; y al negocio, administrar sus productos y recibir y organizar los pedidos desde un panel privado.

---

## ¿Qué incluye?

### Para el cliente
- **Catálogo completo** con productos organizados por categorías (Electrodomésticos, Ferretería, Moda, Variado) y **buscador** para encontrar rápido.
- **Filtros por categoría** con indicador visual de la selección.
- **Precios en CUP** (con soporte USD), **ofertas y descuentos**, etiquetas de productos nuevos y estado de disponibilidad (Disponible / Agotado).
- **Carrito de compras** que se conserva en el dispositivo: agregar, cambiar cantidades, ver total y elegir **retiro en tienda o envío a domicilio**.
- **Pedido por WhatsApp**: al confirmar, se abre WhatsApp con el resumen del pedido (productos, total, tipo de envío y datos del cliente) y un **número de referencia** para identificarlo. El cambio y la confirmación se cierran directo por WhatsApp.
- **Consulta de productos por WhatsApp** con la imagen del producto incluida en el mensaje.
- **Secciones** de Inicio, Catálogo, Contacto y Acerca de, con acceso a la tienda desde el **celular** (QR) o la computadora.

### Para el negocio (panel privado `/adminstore`)
- **Gestión de productos**: agregar, editar y eliminar productos, con opción de oferta, descuento e imagen.
- **Pedidos**: listado con estados **Pendiente → Confirmado → Entregado** (y Cancelado), detalle de cada pedido con sus productos y total, y filtro/búsqueda por número o cliente.
- **Campanita de notificaciones** que avisa de nuevos pedidos con un contador.
- Acceso protegido con usuario y contraseña.

---

## Diseño

- Interfaz pensada para el **móvil** (versión responsive para pantalla pequeña, tablet y escritorio).
- Identidad de marca con colores **granate y dorado**:

| Color | Uso | Código |
|---|---|---|
| Granate | Fondos principales, header | `#62045C` |
| Dorado | Acentos, categoría activa, indicadores | `#C98A3D` |
| Naranja | Llamados a la acción, ofertas | `#E8543F` |
| Morado oscuro | Fondo del encabezado de inicio | `#3A0E38` |

---

## Lo que trae por dentro

- **Una tienda por instalación**: cada negocio tiene su propio contenido, aislado en la base de datos (multi-negocio).
- **Personalización sencilla**: el nombre, el logo, los colores, las categorías y el número de WhatsApp se configuran en un solo lugar (`src/config/`), sin tocar el resto del sitio.
- **Base de datos y respaldo** en la nube (Supabase), con la información de productos y pedidos.
- **Publicado en internet** (Vercel) y con dirección propia para abrir en el celular.

---

## Para desarrolladores

```bash
yarn dev          # Inicia el servidor de desarrollo
yarn build        # Compila para producción
yarn lint         # Revisa el código
yarn format       # Formatea el código
```

Las credenciales (acceso a la base de datos, ID del negocio y número de WhatsApp) se configuran en el archivo `.env` (ver `.env.example`).

Para probar en el celular durante el desarrollo: levantar el servidor (`yarn dev`) y abrir la dirección que muestra Quasar en la red local (o usar el QR generado).

---

*Proyecto de Yyd Solution. Los derechos comerciales y de marca pertenecen a Y4Y Yamira / Yyd Solution.*