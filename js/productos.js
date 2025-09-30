// PRODUCTOS.JS - PADELPROSHOP

// Array completo de productos disponibles en la tienda
const todosLosProductos = [
    // PALAS
    {
        id: 1,
        nombre: "Pala Bullpadel Vertex 03",
        precio: 129999.99,
        stock: 5,
        descripcion: "Pala de alto rendimiento para jugadores avanzados",
        imagen: "../images/productos/vertex-03.jpg",
        categoria: "palas"
    },
    {
        id: 6,
        nombre: "Pala Adidas Drive",
        precio: 89999.99,
        stock: 8,
        descripcion: "Pala de control perfecta para jugadores intermedios",
        imagen: "../images/productos/adidas-drive.webp",
        categoria: "palas"
    },
    {
        id: 7,
        nombre: "Head Speed Pro",
        precio: 149999.99,
        stock: 6,
        descripcion: "Pala de potencia diseñada para jugadores agresivos",
        imagen: "../images/productos/head-speed-pro.png",
        categoria: "palas"
    },
    {
        id: 8,
        nombre: "Wilson Carbon Force",
        precio: 199999.99,
        stock: 4,
        descripcion: "Pala de fibra de carbono para rendimiento profesional",
        imagen: "../images/productos/carbon-force.webp",
        categoria: "palas"
    },
    // CALZADO
    {
        id: 2,
        nombre: "Zapatillas Asics Gel-Padel",
        precio: 89999.99,
        stock: 8,
        descripcion: "Zapatillas específicas para pádel con tecnología Gel",
        imagen: "../images/productos/asics-gel-exclusive.webp",
        categoria: "calzado"
    },
    {
        id: 9,
        nombre: "Adidas Barricade Club",
        precio: 79999.99,
        stock: 10,
        descripcion: "Zapatillas de alto rendimiento para superficies de pádel",
        imagen: "../images/productos/adidas-barricade.webp",
        categoria: "calzado"
    },
    {
        id: 10,
        nombre: "Babolat Jet Padel",
        precio: 94999.99,
        stock: 7,
        descripcion: "Zapatillas ligeras ideales para movimientos rápidos",
        imagen: "../images/productos/babolat-jet.webp",
        categoria: "calzado"
    },
    // ACCESORIOS
    {
        id: 3,
        nombre: "Pelotas Head Padel Pro",
        precio: 12999.99,
        stock: 20,
        descripcion: "Pack de 3 pelotas oficiales para competición",
        imagen: "../images/productos/pelotas-head.webp",
        categoria: "accesorios"
    },
    {
        id: 11,
        nombre: "Grip Wilson Pro",
        precio: 8999.99,
        stock: 25,
        descripcion: "Grip de reemplazo antideslizante",
        imagen: "../images/productos/grip-wilson.png",
        categoria: "accesorios"
    },
    {
        id: 12,
        nombre: "Bolso Paletero Bullpadel",
        precio: 45999.99,
        stock: 8,
        descripcion: "Paletero grande con compartimentos",
        imagen: "../images/productos/bolso-bullpadel.webp",
        categoria: "accesorios"
    },
    {
        id: 13,
        nombre: "Protector de Pala Universal",
        precio: 1599.99,
        stock: 30,
        descripcion: "Protector transparente para tu pala",
        imagen: "../images/productos/protector-pala.webp",
        categoria: "accesorios"
    },
    {
        id: 14,
        nombre: "Muñequeras Deportivas Adidas",
        precio: 9999.99,
        stock: 15,
        descripcion: "Par de muñequeras absorbentes",
        imagen: "../images/productos/muñequeras-adidas.webp",
        categoria: "accesorios"
    },
    {
        id: 15,
        nombre: "Chomba Adidas Tenis-Padel",
        precio: 24000.99,
        stock: 12,
        descripcion: "Chomba transpirable con tecnología de secado rápido",
        imagen: "../images/productos/chomba-adidas.webp",
        categoria: "accesorios"
    },
    {
        id: 4,
        nombre: "Custom Grip Nox",
        precio: 14999.99,
        stock: 15,
        descripcion: "Grip personalizado para mejor agarre",
        imagen: "../images/productos/custom-grip-nox.jpeg",
        categoria: "accesorios"
    },
    {
        id: 5,
        nombre: "Mochila Head Pro",
        precio: 24999.99,
        stock: 10,
        descripcion: "Mochila profesional para equipamiento",
        imagen: "../images/productos/mochila-head-pro.jpeg",
        categoria: "accesorios"
    }
];

// ============================================
// FUNCIONES DE CARRITO

// Obtener carrito actual desde localStorage
function obtenerCarrito() {
    const carrito = localStorage.getItem('carritoProductos');
    return carrito ? JSON.parse(carrito) : [];
}

// Guardar carrito en localStorage
function guardarCarrito(carrito) {
    localStorage.setItem('carritoProductos', JSON.stringify(carrito));
}

// Buscar producto por ID
function buscarProducto(idProducto) {
    return todosLosProductos.find(producto => producto.id === idProducto);
}

// Agregar producto al carrito
function agregarAlCarritoDesdeProductos(idProducto) {
    const producto = buscarProducto(idProducto);
    
    if (!producto) {
        mostrarNotificacion('Producto no encontrado', 'error');
        return;
    }
    
    let carrito = obtenerCarrito();
    const productoEnCarrito = carrito.find(item => item.id === idProducto);
    
    if (productoEnCarrito) {
        if (productoEnCarrito.cantidad >= producto.stock) {
            mostrarNotificacion('Stock máximo alcanzado', 'warning');
            return;
        }
        productoEnCarrito.cantidad += 1;
        productoEnCarrito.subtotal = productoEnCarrito.cantidad * productoEnCarrito.precio;
    } else {
        const nuevoProducto = {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1,
            subtotal: producto.precio,
            imagen: producto.imagen,
            descripcion: producto.descripcion
        };
        carrito.push(nuevoProducto);
    }
    
    guardarCarrito(carrito);
    actualizarContadorCarrito();
    mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'success');
}

// Actualizar contador del carrito en el navbar
function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const totalProductos = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    const enlaces = document.querySelectorAll('a[href*="carrito.html"]');
    
    enlaces.forEach(enlace => {
        if (totalProductos > 0) {
            enlace.textContent = `🛒 Carrito (${totalProductos})`;
        } else {
            enlace.textContent = '🛒 Carrito';
        }
    });
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'info') {
    const colores = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-producto animate__animated animate__fadeInRight';
    notificacion.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colores[tipo]};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 9999;
        max-width: 320px;
        font-weight: 500;
    `;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.remove('animate__fadeInRight');
        notificacion.classList.add('animate__fadeOutRight');
        setTimeout(() => notificacion.remove(), 500);
    }, 3000);
}

// ============================================
// RENDERIZADO DINÁMICO DE PRODUCTOS

// Renderizar productos por categoría
function renderizarProductosPorCategoria(categoria, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;
    
    const productosFiltrados = todosLosProductos.filter(p => p.categoria === categoria);
    contenedor.innerHTML = '';
    
    productosFiltrados.forEach((producto, index) => {
        const col = document.createElement('div');
        col.className = categoria === 'palas' ? 'col-md-6 col-lg-3 product-card' : 'col-md-6 col-lg-4 product-card';
        
        col.innerHTML = `
            <div class="card h-100 animate__animated animate__zoomIn" style="animation-delay: ${index * 0.1}s">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" 
                     style="height: 250px; object-fit: cover">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="h5 text-primary mb-0">$${producto.precio.toLocaleString('es-AR', {minimumFractionDigits: 2})}</span>
                            <span class="badge bg-success">En Stock: ${producto.stock}</span>
                        </div>
                        <button class="btn btn-primary w-100 btn-agregar-carrito" data-producto-id="${producto.id}">
                            Añadir al carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        contenedor.appendChild(col);
    });
}

// Renderizar todos los productos dinámicamente
function renderizarTodosLosProductos() {
    renderizarProductosPorCategoria('palas', 'palasContainer');
    renderizarProductosPorCategoria('calzado', 'calzadoContainer');
    renderizarProductosPorCategoria('accesorios', 'accesoriosContainer');
    
    // Asignar eventos UNA SOLA VEZ después de renderizar TODOS los productos
    asignarEventosBotonesAgregar();
}

// ============================================
// ASIGNACIÓN DE EVENTOS

// Asignar eventos a todos los botones de agregar al carrito
// USANDO DELEGACIÓN DE EVENTOS PARA EVITAR DUPLICADOS
function asignarEventosBotonesAgregar() {
    // Remover listeners anteriores si existen
    const contenedorPrincipal = document.querySelector('.tab-content');
    if (!contenedorPrincipal) return;
    
    // Clonar el elemento para remover todos los event listeners
    const nuevoContenedor = contenedorPrincipal.cloneNode(true);
    contenedorPrincipal.parentNode.replaceChild(nuevoContenedor, contenedorPrincipal);

    
    // Usar delegación de eventos (un solo listener en el contenedor padre)
    nuevoContenedor.addEventListener('click', (e) => {
        // Verificar si el click fue en un botón de agregar al carrito
        if (e.target.classList.contains('btn-agregar-carrito')) {
            e.preventDefault();
            const idProducto = parseInt(e.target.dataset.productoId);
            agregarAlCarritoDesdeProductos(idProducto);
            
            // Efecto visual en el botón
            e.target.textContent = '✓ Agregado';
            e.target.classList.add('btn-success');
            e.target.classList.remove('btn-primary');
            
            setTimeout(() => {
                e.target.textContent = 'Añadir al carrito';
                e.target.classList.remove('btn-success');
                e.target.classList.add('btn-primary');
            }, 1500);
        }
    });
}

// ============================================
// INICIALIZACIÓN

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Renderizar productos dinámicamente
    renderizarTodosLosProductos();
    
    // Actualizar contador del carrito al cargar
    actualizarContadorCarrito();
});

