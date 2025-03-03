const API_URL = 'http://localhost/gestor-productos/api.php';

let productoAEliminar = null;

// funciones de Validacion

function validarStock() {
    const stockInput = document.getElementById('stock');
    stockInput.addEventListener('input', function (e) {
        if (!/^\d+$/.test(e.target.value)) {
            e.target.setCustomValidity('El stock debe ser un número entero.');
        } else {
            e.target.setCustomValidity('');
        }
    });
}

function validarFormulario(formId) {
    const formulario = document.getElementById(formId);
    formulario.addEventListener('submit', function (e) {
        if (!this.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        this.classList.add('was-validated');
    });
}

function mostrarAlerta(mensaje, tipo) {
    const alertContainer = document.getElementById('alertContainer');
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
    alerta.role = 'alert';
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertContainer.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 5000);
}

function limpiarFormularioAgregar() {
    document.getElementById('nombre').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('stock').value = '';
    document.getElementById('formAgregarProducto').classList.remove('was-validated');
}

function inicializarValidaciones() {
    validarStock();
    validarFormulario('formAgregarProducto');
    validarFormulario('formEditarProducto');
}

// Funciones de la API (CRUD)

async function cargarProductos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const productos = await response.json();
        const tabla = document.getElementById('tablaProductos');
        tabla.innerHTML = '';

        productos.forEach(producto => {
            const fila = `
                <tr>
                    <th scope="row">${producto.id}</th>
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.stock}</td>
                    <td>
                        <button type="button" class="btn btn-warning" onclick="abrirModalEditar(${producto.id})">Editar</button>
                        <button type="button" class="btn btn-danger" onclick="abrirModalEliminar(${producto.id})">Eliminar</button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

async function crearProducto() {
    const formAgregar = document.getElementById('formAgregarProducto');

    if (!formAgregar.checkValidity()) {
        formAgregar.classList.add('was-validated');
        return;
    }

    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const stock = parseInt(document.getElementById('stock').value);

    if (isNaN(precio) || precio <= 0) {
        alert("El precio debe ser un número positivo.");
        return;
    }

    if (isNaN(stock) || stock < 0) {
        alert("El stock debe ser un número entero mayor o igual a cero.");
        return;
    }

    const producto = { nombre, descripcion, precio, stock };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(producto),
        });
        const data = await response.json();
        console.log(data);
        cargarProductos();

        const modalAgregar = bootstrap.Modal.getInstance(document.getElementById('agregarProductoModal'));
        modalAgregar.hide();
        limpiarFormularioAgregar();
        mostrarAlerta("Producto creado exitosamente.", "success");
    } catch (error) {
        console.error('Error al crear el producto:', error);
        mostrarAlerta("Error al crear el producto. Verifica la consola para más detalles.", "danger");
    }
}

async function abrirModalEditar(id) {
    try {
        const response = await fetch(`${API_URL}?id=${id}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const producto = await response.json();

        const productoData = Array.isArray(producto) ? producto[0] : producto;

        if (!productoData) {
            throw new Error("No se encontró el producto");
        }

        document.getElementById('idEditar').value = productoData.id;
        document.getElementById('nombreEditar').value = productoData.nombre;
        document.getElementById('descripcionEditar').value = productoData.descripcion;
        document.getElementById('precioEditar').value = productoData.precio;
        document.getElementById('stockEditar').value = productoData.stock;

        new bootstrap.Modal(document.getElementById('editarProductoModal')).show();
    } catch (error) {
        console.error('Error al cargar el producto para editar:', error);
        alert('Error al cargar el producto para editar. Verifica la consola para más detalles.');
    }
}

async function actualizarProducto() {
    const formEditar = document.getElementById('formEditarProducto');

    if (!formEditar.checkValidity()) {
        formEditar.classList.add('was-validated');
        return;
    }

    const id = document.getElementById('idEditar').value;
    const nombre = document.getElementById('nombreEditar').value;
    const descripcion = document.getElementById('descripcionEditar').value;
    const precio = parseFloat(document.getElementById('precioEditar').value);
    const stock = parseInt(document.getElementById('stockEditar').value);

    if (isNaN(precio) || precio <= 0) {
        alert("El precio debe ser un número positivo.");
        return;
    }

    if (isNaN(stock) || stock < 0) {
        alert("El stock debe ser un número entero mayor o igual a cero.");
        return;
    }

    const producto = { id, nombre, descripcion, precio, stock };

    try {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(producto),
        });
        const data = await response.json();
        console.log(data);
        cargarProductos();
        const modalEditar = bootstrap.Modal.getInstance(document.getElementById('editarProductoModal'));
        modalEditar.hide();
        mostrarAlerta("Producto actualizado exitosamente.", "success");
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        mostrarAlerta("Error al actualizar el producto. Verifica la consola para más detalles.", "danger");
    }
}

function abrirModalEliminar(id) {
    productoAEliminar = id;
    new bootstrap.Modal(document.getElementById('confirmarEliminarModal')).show();
}

async function eliminarProducto() {
    try {
        const response = await fetch(`${API_URL}?id=${productoAEliminar}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        console.log(data);
        cargarProductos();

        const modalEliminar = bootstrap.Modal.getInstance(document.getElementById('confirmarEliminarModal'));
        modalEliminar.hide();
        mostrarAlerta("Producto eliminado exitosamente.", "success");
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        mostrarAlerta("Error al eliminar el producto. Verifica la consola para más detalles.", "danger");
    }
}

// Inicialización y Eventos

document.addEventListener('DOMContentLoaded', () => {
    inicializarValidaciones();
    cargarProductos();
});

document.getElementById('btnGuardar').addEventListener('click', crearProducto);
document.getElementById('btnGuardarCambios').addEventListener('click', actualizarProducto);
document.getElementById('btnEliminar').addEventListener('click', eliminarProducto);

document.getElementById('editarProductoModal').addEventListener('hidden.bs.modal', function () {
    const botonEditar = document.querySelector('.btn-warning');
    if (botonEditar) {
        botonEditar.focus();
    }
});

document.getElementById('agregarProductoModal').addEventListener('hidden.bs.modal', function () {
    limpiarFormularioAgregar();
});