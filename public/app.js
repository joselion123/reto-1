class ProveedorAPI {
    constructor() {
        this.urlBase = 'http://localhost:3000/proveedor';
    }

    async solicitud(endpoint, opciones = {}) {
        try {
            const respuesta = await fetch(`${this.urlBase}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...opciones.headers
                },
                ...opciones
            });
            return await respuesta.json();
        } catch (error) {
            throw new Error(`Error en la petición: ${error.message}`);
        }
    }

    async obtenerTodos() {
        return this.solicitud('/listarTodos');
    }

    async crear(datos) {
        return this.solicitud('/insertar', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    }

    async buscarPorApellido(apellido) {
        return this.solicitud(`/buscarporapellido/${encodeURIComponent(apellido)}`);
    }

    async obtenerPorId(id) {
        return this.solicitud(`/buscarporid/${id}`);
    }

    async actualizar(id, datos) {
        return this.solicitud(`/actualizar/${id}`, {
            method: 'PUT',
            body: JSON.stringify(datos)
        });
    }

    async eliminar(id) {
        return this.solicitud(`/eliminar/${id}`, {
            method: 'DELETE'
        });
    }
}

class ProveedorUI {
    constructor() {
        this.api = new ProveedorAPI();
        this.inicializarElementos();
        this.vincularEventos();
        this.cargarProveedores();
    }

    inicializarElementos() {
        this.tabla = document.getElementById('proveedoresTable');
        this.cuerpoTabla = document.getElementById('proveedoresBody');
        this.inputBusqueda = document.getElementById('searchInput');
        this.sinResultados = document.getElementById('noResults');
    }

    vincularEventos() {
        this.inputBusqueda.addEventListener('input', () => this.manejarBusqueda());
        document.addEventListener('DOMContentLoaded', () => this.cargarProveedores());
    }

    async cargarProveedores() {
        try {
            const respuesta = await this.api.obtenerTodos();
            if (respuesta.success) {
                this.renderizarProveedores(respuesta.data);
            } else {
                this.mostrarError(respuesta.message);
            }
        } catch (error) {
            this.mostrarError('Error de conexión con el servidor');
        }
    }

    renderizarProveedores(proveedores) {
        if (!proveedores || proveedores.length === 0) {
            this.mostrarSinResultados();
            return;
        }

        this.ocultarSinResultados();
        this.cuerpoTabla.innerHTML = proveedores.map(proveedor => `
            <tr>
                <td>${proveedor.id || ''}</td>
                <td>${proveedor.nombres || ''}</td>
                <td>${proveedor.apellidos || ''}</td>
                <td>${proveedor.direccion || ''}</td>
                <td>${proveedor.email || ''}</td>
                <td>${proveedor.telefono || ''}</td>
                <td>${proveedor.ciudad || ''}</td>
                <td>${proveedor.estado || ''}</td>
                <td class="actions">
                    <button class="btn btn-edit" onclick="aplicacion.editarProveedor(${proveedor.id})">✏️</button>
                    <button class="btn btn-delete" onclick="aplicacion.eliminarProveedor(${proveedor.id})">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    async manejarBusqueda() {
        const terminoBusqueda = this.inputBusqueda.value.trim();
        
        if (!terminoBusqueda) {
            this.cargarProveedores();
            return;
        }

        try {
            const respuesta = await this.api.buscarPorApellido(terminoBusqueda);
            if (respuesta.success) {
                this.renderizarProveedores(respuesta.data);
            } else {
                this.mostrarError(respuesta.message);
            }
        } catch (error) {
            this.mostrarError('Error al buscar proveedores');
        }
    }

    async eliminarProveedor(id) {
        if (!confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
            return;
        }

        try {
            const respuesta = await this.api.eliminar(id);
            if (respuesta.success) {
                alert('Proveedor eliminado exitosamente');
                this.cargarProveedores();
            } else {
                this.mostrarError(respuesta.message);
            }
        } catch (error) {
            this.mostrarError('Error al eliminar el proveedor');
        }
    }

    async editarProveedor(id) {
        try {
            const respuesta = await this.api.obtenerPorId(id);
            if (respuesta.success) {
                this.abrirModalEdicion(respuesta.data);
            } else {
                this.mostrarError(respuesta.message);
            }
        } catch (error) {
            this.mostrarError('Error al cargar los datos del proveedor');
        }
    }

    abrirModalEdicion(proveedor) {
        console.log('Editar proveedor:', proveedor);
    }

    mostrarSinResultados() {
        this.sinResultados.style.display = 'block';
        this.tabla.style.display = 'none';
    }

    ocultarSinResultados() {
        this.sinResultados.style.display = 'none';
        this.tabla.style.display = 'table';
    }

    mostrarError(mensaje) {
        alert(`Error: ${mensaje}`);
    }
}

const aplicacion = new ProveedorUI();

function filtrarProveedores() {
    aplicacion.manejarBusqueda();
}

function eliminarProveedor(id) {
    aplicacion.eliminarProveedor(id);
}

function editarProveedor(id) {
    aplicacion.editarProveedor(id);
}

function crearProveedor() {
    console.log('Crear nuevo proveedor');
}