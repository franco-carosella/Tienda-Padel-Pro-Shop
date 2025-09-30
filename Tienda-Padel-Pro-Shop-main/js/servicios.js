
// SERVICIOS.JS - PADELPROSHOP
// Maneja la funcionalidad de agregar servicios al carrito

// Array de servicios disponibles
const serviciosDisponibles = [
    {
        id: 101,
        nombre: "Reparación de Palas",
        precio: 15000.00,
        stock: 99,
        descripcion: "Arreglamos tu pala favorita con garantía y materiales de calidad",
        categoria: "servicios"
    },
    {
        id: 102,
        nombre: "Cambio de Grip",
        precio: 8000.00,
        stock: 99,
        descripcion: "Renovamos el grip de tu pala para mayor comodidad y control",
      
        categoria: "servicios"
    },
    {
        id: 103,
        nombre: "Personalización Láser",
        precio: 12000.00,
        stock: 99,
        descripcion: "Grabado láser de tu nombre o logo en palas y accesorios",
       
        categoria: "servicios"
    },
    {
        id: 104,
        nombre: "Asesoramiento Experto",
        precio: 0.00,
        stock: 99,
        descripcion: "Consulta gratuita con nuestros especialistas certificados",
      
        categoria: "servicios"
    },
    {
        id: 105,
        nombre: "Envío Express",
        precio: 6000.00,
        stock: 99,
        descripcion: "Recibe tus productos en 24-48h en toda Argentina",
       
        categoria: "servicios"
    },
    {
        id: 106,
        nombre: "Cambios y Devoluciones",
        precio: 0.00,
        stock: 99,
        descripcion: "15 días para cambios y devoluciones sin complicaciones",
        categoria: "servicios"
    }
];

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

// Buscar servicio por ID
function buscarServicio(idServicio) {
    return serviciosDisponibles.find(servicio => servicio.id === idServicio);
}

// Agregar servicio al carrito
function agregarServicioAlCarrito(idServicio) {
    const servicio = buscarServicio(idServicio);
    
    if (!servicio) {
        mostrarNotificacion('Servicio no encontrado', 'error');
        return;
    }
    
    let carrito = obtenerCarrito();
    const servicioEnCarrito = carrito.find(item => item.id === idServicio);
    
    if (servicioEnCarrito) {
        servicioEnCarrito.cantidad += 1;
        servicioEnCarrito.subtotal = servicioEnCarrito.cantidad * servicioEnCarrito.precio;
    } else {
        const nuevoServicio = {
            id: servicio.id,
            nombre: servicio.nombre,
            precio: servicio.precio,
            cantidad: 1,
            subtotal: servicio.precio,
            imagen: servicio.imagen,
            descripcion: servicio.descripcion
        };
        carrito.push(nuevoServicio);
    }
    
    guardarCarrito(carrito);
    actualizarContadorCarrito();
    
    if (servicio.precio === 0) {
        mostrarNotificacion(`${servicio.nombre} agregado (Servicio gratuito)`, 'success');
    } else {
        mostrarNotificacion(`${servicio.nombre} agregado al carrito`, 'success');
    }
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
    notificacion.className = 'notificacion-servicio animate__animated animate__fadeInRight';
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

// Asignar eventos a los botones de solicitar servicio
function asignarEventosBotonesServicios() {
    const botones = document.querySelectorAll('.btn-solicitar-servicio');
    
    botones.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            const idServicio = parseInt(e.target.dataset.servicioId);
            agregarServicioAlCarrito(idServicio);
            
            // Efecto visual en el botón
            const textoOriginal = e.target.textContent;
            e.target.textContent = '✓ Agregado';
            e.target.classList.add('btn-success');
            e.target.classList.remove('btn-primary', 'btn-outline-primary');
            e.target.disabled = true;
            
            setTimeout(() => {
                e.target.textContent = textoOriginal;
                e.target.classList.remove('btn-success');
                e.target.classList.add(textoOriginal.includes('Consultar') || textoOriginal.includes('Ver') ? 'btn-outline-primary' : 'btn-primary');
                e.target.disabled = false;
            }, 1500);
        });
    });
}

// ============================================
// INICIALIZACIÓN
// ============================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Asignar eventos a botones
    asignarEventosBotonesServicios();
    
    // Actualizar contador del carrito al cargar
    actualizarContadorCarrito();
});