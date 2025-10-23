
// SISTEMA DE CARRITO - PADELPROSHOP
// ============================================

// Array de productos (se cargará desde JSON)
let productosDisponibles = [];

// CARGA DE DATOS CON FETCH
// ============================================

// Cargar productos desde JSON
async function cargarProductosDesdeJSON() {
    try {
        console.log('Cargando productos en carrito...');
        
        const response = await fetch('../productos.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        productosDisponibles = await response.json();
        console.log('Productos cargados en carrito:', productosDisponibles.length);
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarNotificacion('Error al cargar datos. Algunas funciones pueden no estar disponibles.', 'warning');
        
        // Array mínimo de respaldo
        productosDisponibles = [];
    }
}

// Variable global para almacenar el carrito
let carritoProductos = [];

// Códigos de descuento válidos
const codigosDescuento = {
    "TAPIA": 10,
    "PRIMERACOMPRA": 15,
    "PADELPROSHOP": 20
};


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


// FUNCIONES DE BÚSQUEDA Y VALIDACIÓN

// Buscar producto por ID
function buscarProductoPorId(idProducto) {
    return productosDisponibles.find(producto => producto.id === idProducto);
}

// Buscar producto en el carrito
function buscarProductoEnCarrito(idProducto) {
    return carritoProductos.find(producto => producto.id === idProducto);
}


// FUNCIONES DE CARRITO


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

// Eliminar producto del carrito CON CONFIRMACIÓN
function eliminarDelCarrito(idProducto) {
    const productoEnCarrito = buscarProductoEnCarrito(idProducto);
    
    if (!productoEnCarrito) return;
    
    // Sweet Alert de confirmación
    Swal.fire({
        title: '¿Eliminar producto?',
        html: `
            <div style="text-align: left;">
                <p><strong>${productoEnCarrito.nombre}</strong></p>
                <p class="text-muted" style="font-size: 0.9rem;">Cantidad: ${productoEnCarrito.cantidad} | Subtotal: $${productoEnCarrito.subtotal.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>
            </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '✓ Sí, eliminar',
        cancelButtonText: '✗ Cancelar',
        reverseButtons: true,
        focusCancel: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Eliminar el producto
            const indice = carritoProductos.findIndex(producto => producto.id === idProducto);
            const productoEliminado = carritoProductos[indice];
            carritoProductos.splice(indice, 1);
            
            // Guardar cambios
            guardarCarritoEnStorage();
            actualizarVistaCarrito();
            
            // Notificación de éxito
            Swal.fire({
                title: '¡Eliminado!',
                text: `${productoEliminado.nombre} se eliminó del carrito`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        }
    });
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

// Vaciar todo el carrito CON SWEET ALERT
function vaciarCarrito() {
    if (carritoProductos.length === 0) {
        Swal.fire({
            title: 'Carrito vacío',
            text: 'No hay productos para eliminar',
            icon: 'info',
            confirmButtonText: 'Entendido'
        });
        return;
    }
    
    Swal.fire({
        title: '¿Vaciar todo el carrito?',
        html: `
            <p>Se eliminarán <strong>${calcularTotalProductos()} producto(s)</strong></p>
            <p class="text-danger">Esta acción no se puede deshacer</p>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '✓ Sí, vaciar carrito',
        cancelButtonText: '✗ Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            carritoProductos = [];
            guardarCarritoEnStorage();
            actualizarVistaCarrito();
            
            Swal.fire({
                title: '¡Carrito vaciado!',
                text: 'Todos los productos fueron eliminados',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

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

// FINALIZAR COMPRA CON FORMULARIO Y VALIDACIÓN
// ============================================

function finalizarCompra() {
    if (carritoProductos.length === 0) {
        mostrarNotificacion('El carrito está vacío', 'warning');
        return;
    }
    
    const total = calcularSubtotal();
    const descuentoGuardado = localStorage.getItem('descuentoAplicado');
    let descuentoMonto = 0;
    let codigoDescuento = '';
    
    if (descuentoGuardado) {
        const descuento = JSON.parse(descuentoGuardado);
        descuentoMonto = descuento.monto;
        codigoDescuento = descuento.codigo;
    }
    
    const totalFinal = total - descuentoMonto;
    
    // Crear modal con formulario completo
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content animate__animated animate__zoomIn" style="max-width: 650px; max-height: 90vh; overflow-y: auto;">
            <h4 class="text-center mb-4">💳 Finalizar Compra</h4>
            
            <!-- RESUMEN DEL PEDIDO -->
            <div class="alert alert-info mb-4">
                <p class="mb-1"><strong>Total de productos:</strong> ${calcularTotalProductos()}</p>
                <p class="mb-1"><strong>Subtotal:</strong> $${total.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>
                ${descuentoMonto > 0 ? `<p class="mb-1 text-success"><strong>Descuento (${codigoDescuento}):</strong> -$${descuentoMonto.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>` : ''}
                <hr class="my-2">
                <p class="h5 mb-0"><strong>Total a pagar:</strong> $${totalFinal.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>
            </div>
            
            <!-- FORMULARIO DE CHECKOUT -->
            <form id="form-checkout" novalidate>
                <h5 class="mb-3">📋 Datos Personales</h5>
                
                <!-- Nombre Completo -->
                <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre Completo *</label>
                    <input type="text" class="form-control" id="nombre" required 
                           placeholder="Ej: Juan Pérez">
                    <div class="invalid-feedback">Por favor ingrese su nombre completo.</div>
                </div>
                
                <!-- Email -->
                <div class="mb-3">
                    <label for="email" class="form-label">Email *</label>
                    <input type="email" class="form-control" id="email" required 
                           placeholder="ejemplo@email.com">
                    <div class="invalid-feedback">Por favor ingrese un email válido.</div>
                </div>
                
                <!-- Teléfono -->
                <div class="mb-3">
                    <label for="telefono" class="form-label">Teléfono *</label>
                    <input type="tel" class="form-control" id="telefono" required 
                           placeholder="Ej: 351-1234567">
                    <div class="invalid-feedback">Por favor ingrese su teléfono.</div>
                </div>
                
                <!-- Dirección -->
                <div class="mb-3">
                    <label for="direccion" class="form-label">Dirección de Envío *</label>
                    <textarea class="form-control" id="direccion" rows="2" required 
                              placeholder="Calle, número, piso, depto"></textarea>
                    <div class="invalid-feedback">Por favor ingrese su dirección de envío.</div>
                </div>
                
                <!-- Ciudad y Código Postal -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="ciudad" class="form-label">Ciudad *</label>
                        <input type="text" class="form-control" id="ciudad" required 
                               placeholder="Ej: Villa Carlos Paz">
                        <div class="invalid-feedback">Ingrese su ciudad.</div>
                    </div>
                    <div class="col-md-6">
                        <label for="codigo-postal" class="form-label">Código Postal *</label>
                        <input type="text" class="form-control" id="codigo-postal" required 
                               placeholder="Ej: 5152">
                        <div class="invalid-feedback">Ingrese su código postal.</div>
                    </div>
                </div>
                
                <hr class="my-4">
                
                <h5 class="mb-3">💰 Método de Pago</h5>
                
                <!-- Método de Pago -->
                <div class="mb-3">
                    <label for="metodo-pago" class="form-label">Seleccione un método *</label>
                    <select class="form-control" id="metodo-pago" required>
                        <option value="">-- Seleccione --</option>
                        <option value="tarjeta-credito">💳 Tarjeta de Crédito</option>
                        <option value="tarjeta-debito">💳 Tarjeta de Débito</option>
                        <option value="transferencia">🏦 Transferencia Bancaria</option>
                        <option value="mercadopago">💰 MercadoPago</option>
                    </select>
                    <div class="invalid-feedback">Seleccione un método de pago.</div>
                </div>
                
                <!-- CAMPOS CONDICIONALES PARA TARJETA -->
                <div id="campos-tarjeta" style="display: none;">
                    <div class="alert alert-warning" style="font-size: 0.9rem;">
                        🔒 Tus datos están protegidos con encriptación SSL
                    </div>
                    
                    <!-- Número de Tarjeta -->
                    <div class="mb-3">
                        <label for="numero-tarjeta" class="form-label">Número de Tarjeta *</label>
                        <input type="text" class="form-control" id="numero-tarjeta" 
                               placeholder="1234 5678 9012 3456" maxlength="19">
                        <div class="invalid-feedback">Ingrese un número de tarjeta válido (16 dígitos).</div>
                    </div>
                    
                    <!-- Titular de la Tarjeta -->
                    <div class="mb-3">
                        <label for="titular-tarjeta" class="form-label">Titular de la Tarjeta *</label>
                        <input type="text" class="form-control" id="titular-tarjeta" 
                               placeholder="Nombre como aparece en la tarjeta"
                               style="text-transform: uppercase;">
                        <div class="invalid-feedback">Ingrese el nombre del titular.</div>
                    </div>
                    
                    <!-- Vencimiento y CVV -->
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="vencimiento" class="form-label">Vencimiento (MM/AA) *</label>
                            <input type="text" class="form-control" id="vencimiento" 
                                   placeholder="12/25" maxlength="5">
                            <div class="invalid-feedback">Formato: MM/AA</div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="cvv" class="form-label">CVV *</label>
                            <input type="text" class="form-control" id="cvv" 
                                   placeholder="123" maxlength="3">
                            <div class="invalid-feedback">3 dígitos del reverso.</div>
                        </div>
                    </div>
                </div>
                
                <hr class="my-4">
                
                <!-- Botones -->
                <div class="modal-buttons">
                    <button type="submit" class="btn btn-success btn-lg">
                        ✅ Confirmar y Pagar
                    </button>
                    <button type="button" class="btn btn-secondary" id="cancelar-compra">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // EVENTOS Y VALIDACIONES
    // ============================================
    
    // Mostrar/ocultar campos de tarjeta según método de pago
    const selectMetodoPago = document.getElementById('metodo-pago');
    const camposTarjeta = document.getElementById('campos-tarjeta');
    
    selectMetodoPago.addEventListener('change', (e) => {
        const inputsTarjeta = camposTarjeta.querySelectorAll('input');
        
        if (e.target.value.includes('tarjeta')) {
            camposTarjeta.style.display = 'block';
            inputsTarjeta.forEach(input => input.required = true);
        } else {
            camposTarjeta.style.display = 'none';
            inputsTarjeta.forEach(input => {
                input.required = false;
                input.classList.remove('is-invalid');
            });
        }
    });
    
    // Formatear número de tarjeta (agregar espacios cada 4 dígitos)
    const inputNumeroTarjeta = document.getElementById('numero-tarjeta');
    if (inputNumeroTarjeta) {
        inputNumeroTarjeta.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
            let valorFormateado = valor.match(/.{1,4}/g)?.join(' ') || valor;
            e.target.value = valorFormateado;
        });
    }
    
    // Formatear vencimiento (formato MM/AA)
    const inputVencimiento = document.getElementById('vencimiento');
    if (inputVencimiento) {
        inputVencimiento.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length >= 2) {
                valor = valor.slice(0, 2) + '/' + valor.slice(2, 4);
            }
            e.target.value = valor;
        });
    }
    
    // Solo números en CVV
    const inputCVV = document.getElementById('cvv');
    if (inputCVV) {
        inputCVV.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
    
    // Solo números en teléfono
    const inputTelefono = document.getElementById('telefono');
    inputTelefono.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^\d\s\-]/g, '');
    });
    
    // VALIDACIÓN Y ENVÍO DEL FORMULARIO
    // ============================================
    
    const form = document.getElementById('form-checkout');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Remover clases de validación previas
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        
        let formularioValido = true;
        
        // Validar campos básicos
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const direccion = document.getElementById('direccion').value.trim();
        const ciudad = document.getElementById('ciudad').value.trim();
        const codigoPostal = document.getElementById('codigo-postal').value.trim();
        const metodoPago = document.getElementById('metodo-pago').value;
        
        // Validar nombre (mínimo 3 caracteres)
        if (nombre.length < 3) {
            document.getElementById('nombre').classList.add('is-invalid');
            formularioValido = false;
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email').classList.add('is-invalid');
            formularioValido = false;
        }
        
        // Validar teléfono (mínimo 7 dígitos)
        const telefonoSoloNumeros = telefono.replace(/\D/g, '');
        if (telefonoSoloNumeros.length < 7) {
            document.getElementById('telefono').classList.add('is-invalid');
            formularioValido = false;
        }
        
        // Validar dirección
        if (direccion.length < 5) {
            document.getElementById('direccion').classList.add('is-invalid');
            formularioValido = false;
        }
        
        // Validar ciudad
        if (ciudad.length < 3) {
            document.getElementById('ciudad').classList.add('is-invalid');
            formularioValido = false;
        }
        
        // Validar código postal
        if (codigoPostal.length < 4) {
            document.getElementById('codigo-postal').classList.add('is-invalid');
            formularioValido = false;
        }
        
        // Validar método de pago
        if (!metodoPago) {
            document.getElementById('metodo-pago').classList.add('is-invalid');
            formularioValido = false;
        }
        
        // Si eligió tarjeta, validar campos de tarjeta
        if (metodoPago.includes('tarjeta')) {
            const numeroTarjeta = document.getElementById('numero-tarjeta').value.replace(/\s/g, '');
            const titularTarjeta = document.getElementById('titular-tarjeta').value.trim();
            const vencimiento = document.getElementById('vencimiento').value;
            const cvv = document.getElementById('cvv').value;
            
            // Validar número de tarjeta (16 dígitos)
            if (numeroTarjeta.length !== 16 || !/^\d+$/.test(numeroTarjeta)) {
                document.getElementById('numero-tarjeta').classList.add('is-invalid');
                formularioValido = false;
            }
            
            // Validar titular
            if (titularTarjeta.length < 3) {
                document.getElementById('titular-tarjeta').classList.add('is-invalid');
                formularioValido = false;
            }
            
            // Validar vencimiento (formato MM/AA y fecha válida)
            const vencimientoRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!vencimientoRegex.test(vencimiento)) {
                document.getElementById('vencimiento').classList.add('is-invalid');
                formularioValido = false;
            } else {
                // Validar que no esté vencida
                const [mes, año] = vencimiento.split('/');
                const fechaVencimiento = new Date(2000 + parseInt(año), parseInt(mes) - 1);
                const fechaActual = new Date();
                if (fechaVencimiento < fechaActual) {
                    document.getElementById('vencimiento').classList.add('is-invalid');
                    mostrarNotificacion('La tarjeta está vencida', 'error');
                    formularioValido = false;
                }
            }
            
            // Validar CVV (3 dígitos)
            if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
                document.getElementById('cvv').classList.add('is-invalid');
                formularioValido = false;
            }
        }
        
        // Si hay errores, mostrar notificación y detener
        if (!formularioValido) {
            mostrarNotificacion('Por favor complete todos los campos correctamente', 'error');
            return;
        }
        
        // COMPRA EXITOSA
        // ============================================
        
        // Guardar datos de la compra (opcional, para futuras referencias)
        const datosCompra = {
            fecha: new Date().toISOString(),
            cliente: { nombre, email, telefono, direccion, ciudad, codigoPostal },
            metodoPago,
            productos: carritoProductos,
            subtotal: total,
            descuento: descuentoMonto,
            total: totalFinal
        };
        
        console.log('Compra realizada:', datosCompra);
        
        // Limpiar carrito y descuentos
        carritoProductos = [];
        localStorage.removeItem('carritoProductos');
        localStorage.removeItem('descuentoAplicado');
        
        // Cerrar modal de checkout
        modal.remove();
        
        // Mostrar modal de éxito
        const modalExito = document.createElement('div');
        modalExito.className = 'modal-overlay';
        modalExito.innerHTML = `
            <div class="modal-content animate__animated animate__bounceIn" style="max-width: 450px; text-align: center;">
                <div style="font-size: 80px; margin-bottom: 20px;">✅</div>
                <h2 style="color: #28a745; margin-bottom: 20px;">¡Compra Exitosa!</h2>
                <p class="lead">Tu pedido ha sido procesado correctamente</p>
                <div class="alert alert-success my-4">
                    <p class="mb-2"><strong>Número de orden:</strong> #${Math.floor(Math.random() * 999999)}</p>
                    <p class="mb-0"><strong>Total pagado:</strong> $${totalFinal.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>
                </div>
                <p class="text-muted mb-4">
                    📧 Recibirás un email de confirmación en <strong>${email}</strong>
                    <br>📦 Tu pedido llegará en 48-72 horas hábiles
                </p>
                <button class="btn btn-primary btn-lg" id="btn-volver-inicio">
                    Volver al Inicio
                </button>
            </div>
        `;
        document.body.appendChild(modalExito);
        
        document.getElementById('btn-volver-inicio').addEventListener('click', () => {
            window.location.href = '../index.html';
        });
        
        // Actualizar vista del carrito
        actualizarVistaCarrito();
    });
    
    // Botón cancelar
    document.getElementById('cancelar-compra').addEventListener('click', () => {
        modal.remove();
    });
    
    // Cerrar modal al hacer click fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// INICIALIZACIÓN
// ============================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    // IMPORTANTE: Cargar productos primero
    await cargarProductosDesdeJSON();
    
    // Luego inicializar el carrito
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