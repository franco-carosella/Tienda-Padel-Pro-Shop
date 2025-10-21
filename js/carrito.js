// ============================================
// SISTEMA DE CARRITO - PADELPROSHOP
// ============================================

// Array completo de productos disponibles en la tienda
const productosDisponibles = [
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

// Variable global para almacenar el carrito
let carritoProductos = [];

// Códigos de descuento válidos
const codigosDescuento = {
    "TAPIA": 10,
    "PRIMERACOMPRA": 15,
    "PADELPROSHOP": 20
};

// ============================================
// FUNCIONES DE STORAGE
// ============================================

// Cargar carrito desde localStorage
function cargarCarritoDesdeStorage() {
    const carritoGuardado = localStorage.getItem('carritoProductos');
    if (carritoGuardado) {
        carritoProductos = JSON.parse(carritoGuardado);
    }
}

// Guardar carrito en localStorage
function guardarCarritoEnStorage() {
    localStorage.setItem('carritoProductos', JSON.stringify(carritoProductos));
}

// ============================================
// FUNCIONES DE BÚSQUEDA Y VALIDACIÓN
// ============================================

// Buscar producto por ID
function buscarProductoPorId(idProducto) {
    return productosDisponibles.find(producto => producto.id === idProducto);
}

// Buscar producto en el carrito
function buscarProductoEnCarrito(idProducto) {
    return carritoProductos.find(producto => producto.id === idProducto);
}

// ============================================
// FUNCIONES DE CARRITO
// ============================================

// Agregar producto al carrito
function agregarAlCarrito(idProducto, cantidad = 1) {
    const producto = buscarProductoPorId(idProducto);
    
    if (!producto) {
        mostrarNotificacion('Producto no encontrado', 'error');
        return;
    }
    
    if (producto.stock < cantidad) {
        mostrarNotificacion('Stock insuficiente', 'error');
        return;
    }
    
    const productoEnCarrito = buscarProductoEnCarrito(idProducto);
    
    if (productoEnCarrito) {
        productoEnCarrito.cantidad += cantidad;
        productoEnCarrito.subtotal = productoEnCarrito.cantidad * productoEnCarrito.precio;
    } else {
        const nuevoProducto = {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: cantidad,
            subtotal: producto.precio * cantidad,
            imagen: producto.imagen,
            descripcion: producto.descripcion
        };
        carritoProductos.push(nuevoProducto);
    }
    
    guardarCarritoEnStorage();
    actualizarVistaCarrito();
    mostrarNotificacion('Producto agregado al carrito', 'success');
}

// Eliminar producto del carrito
function eliminarDelCarrito(idProducto) {
    const indice = carritoProductos.findIndex(producto => producto.id === idProducto);
    
    if (indice !== -1) {
        const productoEliminado = carritoProductos[indice];
        carritoProductos.splice(indice, 1);
        guardarCarritoEnStorage();
        actualizarVistaCarrito();
        mostrarNotificacion(`${productoEliminado.nombre} eliminado del carrito`, 'info');
    }
}

// Modificar cantidad de un producto
function modificarCantidad(idProducto, nuevaCantidad) {
    const productoEnCarrito = buscarProductoEnCarrito(idProducto);
    const producto = buscarProductoPorId(idProducto);
    
    if (!productoEnCarrito || !producto) return;
    
    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(idProducto);
        return;
    }
    
    if (nuevaCantidad > producto.stock) {
        mostrarNotificacion(`Stock máximo: ${producto.stock} unidades`, 'warning');
        return;
    }
    
    productoEnCarrito.cantidad = nuevaCantidad;
    productoEnCarrito.subtotal = productoEnCarrito.cantidad * productoEnCarrito.precio;
    
    guardarCarritoEnStorage();
    actualizarVistaCarrito();
}

// Vaciar todo el carrito
function vaciarCarrito() {
    if (carritoProductos.length === 0) {
        mostrarNotificacion('El carrito ya está vacío', 'info');
        return;
    }
    
    // Crear modal de confirmación
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content animate__animated animate__zoomIn">
            <h4>¿Vaciar carrito?</h4>
            <p>Se eliminarán todos los productos del carrito.</p>
            <div class="modal-buttons">
                <button class="btn btn-danger" id="confirmar-vaciar">Sí, vaciar</button>
                <button class="btn btn-secondary" id="cancelar-vaciar">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('confirmar-vaciar').addEventListener('click', () => {
        carritoProductos = [];
        guardarCarritoEnStorage();
        actualizarVistaCarrito();
        mostrarNotificacion('Carrito vaciado', 'success');
        modal.remove();
    });
    
    document.getElementById('cancelar-vaciar').addEventListener('click', () => {
        modal.remove();
    });
}

// ============================================
// FUNCIONES DE CÁLCULO
// ============================================

// Calcular subtotal del carrito
function calcularSubtotal() {
    return carritoProductos.reduce((total, producto) => total + producto.subtotal, 0);
}

// Calcular total de productos
function calcularTotalProductos() {
    return carritoProductos.reduce((total, producto) => total + producto.cantidad, 0);
}

// Aplicar código de descuento
function aplicarCodigoDescuento() {
    const inputCodigo = document.getElementById('promoCode');
    const codigo = inputCodigo.value.trim().toUpperCase();
    
    if (!codigo) {
        mostrarNotificacion('Ingrese un código de descuento', 'warning');
        return;
    }
    
    const descuentoPorcentaje = codigosDescuento[codigo];
    
    if (!descuentoPorcentaje) {
        mostrarNotificacion('Código de descuento inválido', 'error');
        return;
    }
    
    const subtotal = calcularSubtotal();
    const descuentoMonto = subtotal * (descuentoPorcentaje / 100);
    
    // Guardar descuento en storage
    localStorage.setItem('descuentoAplicado', JSON.stringify({
        codigo: codigo,
        porcentaje: descuentoPorcentaje,
        monto: descuentoMonto
    }));
    
    actualizarVistaCarrito();
    mostrarNotificacion(`¡Descuento del ${descuentoPorcentaje}% aplicado!`, 'success');
    inputCodigo.value = '';
}

// ============================================
// FUNCIONES DE VISUALIZACIÓN DOM
// ============================================

// Renderizar productos en el carrito
function renderizarProductosCarrito() {
    const contenedor = document.getElementById('productos-carrito-container');
    
    if (!contenedor) return;
    
    if (carritoProductos.length === 0) {
        contenedor.innerHTML = `
            <div class="carrito-vacio text-center py-5">
                <h3>🛒 Tu carrito está vacío</h3>
                <p class="text-muted">Agrega productos para comenzar tu compra</p>
                <a href="../index.html" class="btn btn-primary mt-3">Ver Productos</a>
            </div>
        `;
        return;
    }
    
    contenedor.innerHTML = '';
    
    carritoProductos.forEach(producto => {
        const itemCarrito = document.createElement('div');
        itemCarrito.className = 'cart-item p-4 mb-4 animate__animated animate__fadeIn';
        
        // Verificar si es un servicio (ID >= 101)
        const esServicio = producto.id >= 101;
        
        if (esServicio) {
            // Diseño para servicios (sin imagen)
            itemCarrito.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <div class="d-flex align-items-center">
                            <div class="service-badge me-3">🛠️</div>
                            <div>
                                <h5 class="mb-1">${producto.nombre}</h5>
                                <p class="text-muted mb-0">${producto.descripcion}</p>
                                <small class="text-info">✨ Servicio</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="quantity-controls">
                            <button class="quantity-btn" data-accion="decrementar" data-id="${producto.id}">-</button>
                            <span class="fw-bold">${producto.cantidad}</span>
                            <button class="quantity-btn" data-accion="incrementar" data-id="${producto.id}">+</button>
                        </div>
                    </div>
                    <div class="col-md-2 text-center">
                        <span class="h5 text-primary">${producto.subtotal.toLocaleString('es-AR', {minimumFractionDigits: 2})}</span>
                        ${producto.cantidad > 1 ? `<br><small class="text-muted">${producto.precio.toLocaleString('es-AR', {minimumFractionDigits: 2})} c/u</small>` : ''}
                    </div>
                    <div class="col-md-2 text-end">
                        <button class="btn btn-outline-danger btn-sm btn-eliminar" data-id="${producto.id}">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            `;
        } else {
            // Diseño para productos (con imagen)
            itemCarrito.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${producto.imagen}" alt="${producto.nombre}" 
                             class="img-fluid rounded" style="height: 100px; object-fit: cover">
                    </div>
                    <div class="col-md-4">
                        <h5 class="mb-1">${producto.nombre}</h5>
                        <p class="text-muted mb-0">${producto.descripcion}</p>
                        <small class="text-success">✅ En stock</small>
                    </div>
                    <div class="col-md-2">
                        <div class="quantity-controls">
                            <button class="quantity-btn" data-accion="decrementar" data-id="${producto.id}">-</button>
                            <span class="fw-bold">${producto.cantidad}</span>
                            <button class="quantity-btn" data-accion="incrementar" data-id="${producto.id}">+</button>
                        </div>
                    </div>
                    <div class="col-md-2 text-center">
                        <span class="h5 text-primary">${producto.subtotal.toLocaleString('es-AR', {minimumFractionDigits: 2})}</span>
                        ${producto.cantidad > 1 ? `<br><small class="text-muted">${producto.precio.toLocaleString('es-AR', {minimumFractionDigits: 2})} c/u</small>` : ''}
                    </div>
                    <div class="col-md-2 text-end">
                        <button class="btn btn-outline-danger btn-sm btn-eliminar" data-id="${producto.id}">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            `;
        }
        
        contenedor.appendChild(itemCarrito);
    });
    
    // Asignar eventos a los botones
    asignarEventosBotonesCarrito();
}

// Actualizar resumen del pedido
function actualizarResumen() {
    const subtotal = calcularSubtotal();
    const totalProductos = calcularTotalProductos();
    
    // Obtener descuento guardado
    const descuentoGuardado = localStorage.getItem('descuentoAplicado');
    let descuentoMonto = 0;
    
    if (descuentoGuardado) {
        const descuento = JSON.parse(descuentoGuardado);
        descuentoMonto = descuento.monto;
    }
    
    const total = subtotal - descuentoMonto;
    
    // Actualizar elementos del DOM
    const elementoSubtotal = document.querySelector('.resumen-subtotal');
    const elementoDescuento = document.getElementById('discount');
    const elementoTotal = document.getElementById('total');
    const elementoCantidad = document.querySelector('.cantidad-productos');
    
    if (elementoSubtotal) {
        elementoSubtotal.textContent = `$${subtotal.toLocaleString('es-AR', {minimumFractionDigits: 2})}`;
    }
    
    if (elementoDescuento) {
        elementoDescuento.textContent = `-$${descuentoMonto.toLocaleString('es-AR', {minimumFractionDigits: 2})}`;
    }
    
    if (elementoTotal) {
        elementoTotal.textContent = `$${total.toLocaleString('es-AR', {minimumFractionDigits: 2})}`;
    }
    
    if (elementoCantidad) {
        elementoCantidad.textContent = `Subtotal (${totalProductos} producto${totalProductos !== 1 ? 's' : ''}):`;
    }
}

// Actualizar vista completa del carrito
function actualizarVistaCarrito() {
    renderizarProductosCarrito();
    actualizarResumen();
    actualizarContadorCarrito();
}

// Actualizar contador del carrito en el navbar
function actualizarContadorCarrito() {
    const totalProductos = calcularTotalProductos();
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
    notificacion.className = 'notificacion animate__animated animate__fadeInRight';
    notificacion.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colores[tipo]};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        max-width: 300px;
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

// Asignar eventos a botones del carrito
function asignarEventosBotonesCarrito() {
    // Botones de cantidad
    document.querySelectorAll('.quantity-btn').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const accion = e.target.dataset.accion;
            const productoEnCarrito = buscarProductoEnCarrito(id);
            
            if (!productoEnCarrito) return;
            
            if (accion === 'incrementar') {
                modificarCantidad(id, productoEnCarrito.cantidad + 1);
            } else if (accion === 'decrementar') {
                modificarCantidad(id, productoEnCarrito.cantidad - 1);
            }
        });
    });
    
    // Botones de eliminar
    document.querySelectorAll('.btn-eliminar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            eliminarDelCarrito(id);
        });
    });
}

// Asignar eventos globales
function asignarEventosGlobales() {
    // Botón vaciar carrito
    const btnVaciar = document.querySelector('.btn-vaciar-carrito');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', vaciarCarrito);
    }
    
    // Botón aplicar código de descuento
    const btnAplicarCodigo = document.querySelector('.btn-aplicar-codigo');
    if (btnAplicarCodigo) {
        btnAplicarCodigo.addEventListener('click', aplicarCodigoDescuento);
    }
    
    // Enter en input de código
    const inputCodigo = document.getElementById('promoCode');
    if (inputCodigo) {
        inputCodigo.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                aplicarCodigoDescuento();
            }
        });
    }
    
    // Botón proceder al pago
    const btnProceder = document.querySelector('.btn-proceder-pago');
    if (btnProceder) {
        btnProceder.addEventListener('click', finalizarCompra);
    }
    
    // Botones de productos recomendados
    document.querySelectorAll('.btn-agregar-recomendado').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            agregarAlCarrito(id, 1);
        });
    });
}

// ============================================
// FINALIZAR COMPRA
// ============================================

function finalizarCompra() {
    if (carritoProductos.length === 0) {
        mostrarNotificacion('El carrito está vacío', 'warning');
        return;
    }
    
    const total = calcularSubtotal();
    const descuentoGuardado = localStorage.getItem('descuentoAplicado');
    let descuentoMonto = 0;
    
    if (descuentoGuardado) {
        const descuento = JSON.parse(descuentoGuardado);
        descuentoMonto = descuento.monto;
    }
    
    const totalFinal = total - descuentoMonto;
    
    // Crear modal de confirmación
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content animate__animated animate__zoomIn" style="max-width: 500px;">
            <h4>💳 Finalizar Compra</h4>
            <div class="resumen-compra mb-3">
                <p><strong>Total de productos:</strong> ${calcularTotalProductos()}</p>
                <p><strong>Subtotal:</strong> $${total.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>
                ${descuentoMonto > 0 ? `<p class="text-success"><strong>Descuento:</strong> -$${descuentoMonto.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>` : ''}
                <hr>
                <p class="h5"><strong>Total a pagar:</strong> $${totalFinal.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>
            </div>
            <div class="metodos-pago mb-3">
                <label class="d-block mb-2"><strong>Método de pago:</strong></label>
                <select class="form-control" id="metodo-pago">
                    <option value="">Seleccione un método</option>
                    <option value="tarjeta-credito">💳 Tarjeta de Crédito</option>
                    <option value="tarjeta-debito">💳 Tarjeta de Débito</option>
                    <option value="transferencia">🏦 Transferencia Bancaria</option>
                    <option value="mercadopago">💰 MercadoPago</option>
                </select>
            </div>
            <div class="modal-buttons">
                <button class="btn btn-success" id="confirmar-compra">✅ Confirmar Compra</button>
                <button class="btn btn-secondary" id="cancelar-compra">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('confirmar-compra').addEventListener('click', () => {
        const metodoPago = document.getElementById('metodo-pago').value;
        
        if (!metodoPago) {
            mostrarNotificacion('Seleccione un método de pago', 'warning');
            return;
        }
        
        // Simular compra exitosa
        carritoProductos = [];
        localStorage.removeItem('carritoProductos');
        localStorage.removeItem('descuentoAplicado');
        
        modal.remove();
        
        // Mostrar mensaje de éxito
        const modalExito = document.createElement('div');
        modalExito.className = 'modal-overlay';
        modalExito.innerHTML = `
            <div class="modal-content animate__animated animate__bounceIn" style="max-width: 400px; text-align: center;">
                <h2 style="color: #28a745;">✅ ¡Compra Exitosa!</h2>
                <p class="mt-3">Tu pedido ha sido procesado correctamente.</p>
                <p><strong>Total pagado:</strong> $${totalFinal.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>
                <p class="text-muted">Recibirás un email de confirmación en breve.</p>
                <button class="btn btn-primary mt-3" id="btn-volver-inicio">Volver al Inicio</button>
            </div>
        `;
        document.body.appendChild(modalExito);
        
        document.getElementById('btn-volver-inicio').addEventListener('click', () => {
            window.location.href = '../index.html';
        });
        
        actualizarVistaCarrito();
    });
    
    document.getElementById('cancelar-compra').addEventListener('click', () => {
        modal.remove();
    });
}

// ============================================
// INICIALIZACIÓN
// ============================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    cargarCarritoDesdeStorage();
    actualizarVistaCarrito();
    asignarEventosGlobales();
});

// Estilos CSS adicionales (agregar al final del archivo)
const estilosAdicionales = `
    <style>
        .cart-item {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .cart-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }
        
        .quantity-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .quantity-btn {
            width: 30px;
            height: 30px;
            border: 2px solid #007bff;
            background: white;
            color: #007bff;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .quantity-btn:hover {
            background: #007bff;
            color: white;
        }
        
        .cart-summary {
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        .modal-content {
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 90%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }
        
        .modal-buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
        }
        
        .carrito-vacio {
            background: white;
            border-radius: 15px;
            padding: 50px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        
        .service-badge {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            flex-shrink: 0;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', estilosAdicionales);