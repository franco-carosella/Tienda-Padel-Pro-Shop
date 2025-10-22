// INDEX.JS - PADELPROSHOP

// Array de productos (se cargará desde JSON)
let productosDisponibles = [];

// ============================================
// CARGA DE DATOS CON FETCH
// ============================================

// Cargar productos desde JSON
async function cargarProductosDesdeJSON() {
    try {
        // Mostrar indicador de carga
        console.log('Cargando productos...');
        
        const response = await fetch('./productos.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        productosDisponibles = await response.json();
        console.log('Productos cargados exitosamente:', productosDisponibles.length);
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarNotificacion('Error al cargar los productos. Por favor, recarga la página.', 'error');
        
        // Productos de respaldo en caso de error
        productosDisponibles = [
            {
                id: 1,
                nombre: "Pala Bullpadel Vertex 03",
                precio: 129999.99,
                stock: 5,
                descripcion: "Pala de alto rendimiento para jugadores avanzados",
                imagen: "images/productos/vertex-03.jpg",
                categoria: "palas"
            },
            {
                id: 2,
                nombre: "Zapatillas Asics Gel-Padel",
                precio: 89999.99,
                stock: 8,
                descripcion: "Zapatillas específicas para pádel con tecnología Gel",
                imagen: "images/productos/asics-gel.webp",
                categoria: "calzado"
            },
            {
                id: 3,
                nombre: "Pelotas Head Padel Pro",
                precio: 12999.99,
                stock: 20,
                descripcion: "Pack de 3 pelotas oficiales para competición",
                imagen: "images/productos/pelotas-head.webp",
                categoria: "accesorios"
            }
        ];
    }
}

// ============================================
// FUNCIONES DE CARRITO
// ============================================

// Obtener carrito desde localStorage
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
    return productosDisponibles.find(producto => producto.id === idProducto);
}

// Agregar producto al carrito
function agregarAlCarrito(idProducto) {
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
    notificacion.className = 'notificacion-index animate__animated animate__fadeInRight';
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
// ASIGNACIÓN DE EVENTOS
// ============================================

// Asignar eventos a los botones de agregar al carrito
function asignarEventosBotones() {
    const botones = document.querySelectorAll('.btn-agregar-carrito-index');
    
    botones.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            const idProducto = parseInt(e.target.dataset.productoId);
            agregarAlCarrito(idProducto);
            
            // Efecto visual en el botón
            const textoOriginal = e.target.textContent;
            e.target.textContent = '✓ Agregado';
            e.target.classList.add('btn-success');
            e.target.classList.remove('btn-primary');
            e.target.disabled = true;
            
            setTimeout(() => {
                e.target.textContent = textoOriginal;
                e.target.classList.remove('btn-success');
                e.target.classList.add('btn-primary');
                e.target.disabled = false;
            }, 1500);
        });
    });
}

// ============================================
// INICIALIZACIÓN
// ============================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    // IMPORTANTE: Cargar productos primero con fetch
    await cargarProductosDesdeJSON();
    
    // Asignar eventos a botones
    asignarEventosBotones();
    
    // Actualizar contador del carrito al cargar
    actualizarContadorCarrito();
});