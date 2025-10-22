# PadelProShop - Mi Proyecto Final de JavaScript

Hola! Este es mi proyecto final para el curso de JavaScript de Coderhouse. Es una tienda online de productos de pádel que hice desde cero.

## ¿Qué hace este proyecto?

Básicamente es un ecommerce simulado donde podes:
- Ver productos de pádel (palas, zapatillas, accesorios)
- Agregar cosas al carrito
- Cambiar las cantidades o sacar productos
- Usar códigos de descuento
- Completar un formulario para "comprar" (es simulado, no compras nada de verdad jaja)

## Cómo usar el proyecto

1. Descarga o clona el repositorio
2. Abre el archivo `index.html` en tu navegador
3. Navega por las páginas y agrega productos al carrito
4. Cuando tengas productos en el carrito, anda a "Carrito" y hace click en "Proceder al Pago"
5. Completa el formulario (los datos no van a ningún lado, es solo para practicar)

## Códigos de descuento que funcionan

Si queres probar los descuentos, usa alguno de estos códigos:
- **TAPIA** → 10% de descuento
- **PRIMERACOMPRA** → 15% de descuento
- **PADELPROSHOP** → 20% de descuento

## Tecnologías que use

- HTML5 y CSS3 para la estructura y estilos
- JavaScript para toda la lógica
- Bootstrap 5 para que se vea mejor y sea responsive
- Animate.css para algunas animaciones
- LocalStorage para guardar el carrito
- Fetch API para cargar los productos desde un JSON
- Sweet Alert 2 para eliminar productos del carrito u vaciarlo por completo
## Estructura del proyecto
```
├── index.html          (página principal)
├── productos.json      (todos los productos en formato JSON)
├── servicios.json      (servicios que ofrece la tienda)
├── css/
│   └── style.css       (estilos personalizados)
├── js/
│   ├── index.js        (lógica de la página principal)
│   ├── productos.js    (maneja la página de productos)
│   ├── carrito.js      (toda la lógica del carrito)
│   └── servicios.js    (para agregar servicios al carrito)
├── pages/
│   ├── productos.html
│   ├── carrito.html
│   ├── servicios.html
│   ├── contacto.html
│   └── sobre-nosotros.html
└── images/
    ├── productos/      (imágenes de los productos)
    └── logo/           (logo de la tienda)
```

## Funcionalidades principales

### Carrito de compras
- Los productos se guardan en LocalStorage, así que si cerras la página y volves, siguen ahí
- Podes cambiar cantidades con los botones + y -
- Te muestra el total y subtotal
- Tiene un botón para vaciar todo el carrito

### Formulario de compra
Cuando vas a finalizar la compra, te pide:
- Nombre completo
- Email (valida que sea un email de verdad)
- Teléfono
- Dirección de envío
- Ciudad y código postal
- Método de pago

Si elegis pagar con tarjeta, te pide también:
- Número de tarjeta (tiene que ser de 16 dígitos)
- Nombre del titular
- Fecha de vencimiento
- CVV

Todo esto lo valida antes de dejar confirmar la compra.

## Autor

Franco Carosella - Proyecto Final JavaScript CoderHouse 2025

## Link del proyecto

- **GitHub Pages:** https://franco-carosella.github.io/Tienda-Padel-Pro-Shop/
- **Repositorio:** https://github.com/franco-carosella/Tienda-Padel-Pro-Shop

---

Cualquier duda o sugerencia, déjame un mensaje!