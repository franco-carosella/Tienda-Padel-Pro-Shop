// PRODUCTOS.JS - PADELPROSHOP

// BASE_PATH PARA GITHUB PAGE Y LOCAL
const BASE_PATH = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? '' 
    : '/Tienda-Padel-Pro-Shop';

// Array de productos (se cargará desde JSON)
let todosLosProductos = [];

// CARGA DE DATOS CON FETCH
// ============================================

// Cargar productos desde JSON
async function cargarProductosDesdeJSON() {
    try {
        console.log('Cargando productos desde JSON...');
        
        const response = await fetch('../productos.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        todosLosProductos = await response.json();
        console.log('Productos cargados:', todosLosProductos.length);
        
        // Después de cargar, renderizar los productos
        renderizarTodosLosProductos();
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarNotificacion('Error al cargar productos. Intenta recargar la página.', 'error');
        
        // Productos de respaldo
        todosLosProductos = [
            {
                id: 1,
                nombre: "Pala Bullpadel Vertex 03",
                precio: 129999.99,
                stock: 5,
                descripcion: "Pala de alto rendimiento para jugadores avanzados",
                imagen: "/images/productos/vertex-03.jpg",
                categoria: "palas"
            }
        ];
        
        renderizarTodosLosProductos();
    }
}

// FUNCIONES DE CARRITO
// ============================================

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
            imagen: BASE_PATH + producto.imagen, // ⬅️ AQUÍ AGREGAMOS BASE_PATH
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

// RENDERIZADO DINÁMICO DE PRODUCTOS
// ============================================

// Renderizar productos por categoría
function renderizarProductosPorCategoria(categoria, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;
    
    const productosFiltrados = todosLosProductos.filter(p => p.categoria === categoria);
    contenedor.innerHTML = '';
    
    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = '<p class="text-center">Cargando productos...</p>';
        return;
    }
    
    productosFiltrados.forEach((producto, index) => {
        const col = document.createElement('div');
        col.className = categoria === 'palas' ? 'col-md-6 col-lg-3 product-card' : 'col-md-6 col-lg-4 product-card';
        
        col.innerHTML = `
            <div class="card h-100 animate__animated animate__zoomIn" style="animation-delay: ${index * 0.1}s">
                <img src="${BASE_PATH + producto.imagen}" class="card-img-top" alt="${producto.nombre}" 
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
    
    // Asignar eventos después de renderizar
    asignarEventosBotonesAgregar();
}

// ASIGNACIÓN DE EVENTOS
// ============================================

// Asignar eventos a todos los botones de agregar al carrito
function asignarEventosBotonesAgregar() {
    const contenedorPrincipal = document.querySelector('.tab-content');
    if (!contenedorPrincipal) return;
    
    // Clonar para limpiar listeners previos
    const nuevoContenedor = contenedorPrincipal.cloneNode(true);
    contenedorPrincipal.parentNode.replaceChild(nuevoContenedor, contenedorPrincipal);
    
    // Usar delegación de eventos
    nuevoContenedor.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-agregar-carrito')) {
            e.preventDefault();
            const idProducto = parseInt(e.target.dataset.productoId);
            agregarAlCarritoDesdeProductos(idProducto);
            
            // Efecto visual
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

// INICIALIZACIÓN
// ============================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    // IMPORTANTE: Cargar productos con fetch primero
    await cargarProductosDesdeJSON();
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();
});